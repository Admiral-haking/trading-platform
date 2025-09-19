import { logSignal, Signals, type Signal } from "../../../models/Signal";
import { Coinex } from "../../coinex";
import { LLMReturnType } from "../../LLM/components/types";
import { Market } from "../../market";
import { sizeOrderFromNotionalLimit } from "../utils/notional";
import { orderStateToSignalState } from "../utils/state";
import { TraderWithdrawal } from "./withdrawal";
import { broadcast } from "../../../ws";
import { compareBasedOnSide } from "../utils/compare";

export class TraderOrder extends TraderWithdrawal {

    constructor() {
        super();
    }

    async doesOrderConflicts({ market, position }: LLMReturnType) {
        const signal = await Signals.findOne({ market, position, state: { $in: ["order placed", "filled"] } });

        return !!signal
    }

    async placeOrder(signal: Signal) {

        const conflict = await this.doesOrderConflicts(signal);

        await logSignal(signal, "Initiating Place Order...");

        if (conflict) {
            return await logSignal(signal, "Order is Conflicting with an other Order.")
        }

        if (!Market.hasMarket({ market: signal.market })) {
            signal.state = "cancelled";
            return await logSignal(signal, "Place Order is Skipped. coinex does not have this currency for trading!")
        }


        const last_price = Market.getPrice(signal);

        if (last_price !== -1 && compareBasedOnSide(signal.position, last_price, signal.entry)) {
            const notional = sizeOrderFromNotionalLimit({
                price: signal.entry,
                targetNotionalUSDT: this.eachTraderAmount * signal.leverage,
                marketFullStatus: Market.markets[signal.market.toUpperCase()]
            })

            if (!notional.ok) {
                signal.state = "cancelled";
                return await logSignal(signal, `Order Skipped. reason: ${notional.reason}`)
            }

            if (notional.priceAdjusted) {
                signal.entry = notional.price;
                await logSignal(signal, "Warning: Order entry price has been adjusted!")
            }

            await this.updateBalances();
            if ((this.featuresUSDTBalance * signal.leverage) <= notional.amount) {
                return await logSignal(signal, "Place Order is Skipped. we don't have enough USDT!")
            }
            await logSignal(signal, "Placing Order (limit)...");
            const { data } = await Coinex.place_order({
                amount: notional.amountStr,
                market: signal.market,
                market_type: "FUTURES",
                side: signal.position === 'LONG' ? "buy" : "sell",
                type: "limit",
                price: notional.priceStr,
                client_id: signal._id.toString("hex"),
            });

            signal.orderId = data.order_id;
            signal.state = "order placed";

            await logSignal(signal, "Order Placed Successfully. returned order_id is ".concat(data.order_id.toString()))

            await signal.save();

            return data;
        }
        const notional = sizeOrderFromNotionalLimit({
            price: last_price,
            targetNotionalUSDT: this.eachTraderAmount * signal.leverage,
            marketFullStatus: Market.markets[signal.market.toUpperCase()]
        })

        if (!notional.ok) {
            signal.state = "cancelled";
            return await logSignal(signal, `Order Skipped. reason: ${notional.reason}`)
        }

        if (notional.priceAdjusted) {
            signal.entry = notional.price;
            await logSignal(signal, "Warning: Order entry price has been adjusted!")
        }

        await this.updateBalances();
        if ((this.featuresUSDTBalance * signal.leverage) <= notional.amount) {
            return await logSignal(signal, "Place Order is Skipped. we don't have enough USDT!")
        }
        await logSignal(signal, "Placing Order (market)...");
        const { data } = await Coinex.place_order({
            amount: notional.amountStr,
            market: signal.market,
            market_type: "FUTURES",
            side: signal.position === 'LONG' ? "buy" : "sell",
            type: "market",
            client_id: signal._id.toString("hex"),
        });

        signal.orderId = data.order_id;
        signal.state = "order placed";

        await logSignal(signal, "Order Placed Successfully. returned order_id is ".concat(data.order_id.toString()))

        await signal.save();

        return data;
    }

    async getOrderStatus(signal: Signal) {
        if (!signal.orderId) return;

        const { data } = await Coinex.get_order_status({ market: signal.market, order_id: signal.orderId });

        signal.realized_pnl = Number(data.realized_pnl || "0");

        signal.state = orderStateToSignalState(data.status);

        try {
            const { data: positions } = await Coinex.get_pending_positions({ market_type: "FUTURES", market: signal.market });
            const position = positions.find(x => x.market === signal.market && x.side === signal.position.toLowerCase());
            if (position) {
                signal.realized_pnl = Number(position.realized_pnl || "0");

                signal.state = "filled";

                signal.positionId = position.position_id


                await logSignal(signal, "Position Founded. Changing State to 'filled'.");

                try {
                    broadcast({ type: 'order:filled', payload: { _id: signal._id, market: signal.market, orderId: signal.orderId, positionId: signal.positionId } });
                } catch { }
            }
        }
        catch { }

        await signal.save()
    }

    async cancelOrder(orderId: number) {

        const signal = await Signals.findOne({ orderId });

        if (!signal) {
            return;
        }
        await logSignal(signal, "Cancelling Order...");

        if (signal.state === 'filled' || signal.state === 'finished') {

            await logSignal(signal, "Order cannot be cancel due to finished or filled state.");
            return
        }

        const { data } = await Coinex.cancel_order({ market: signal.market, market_type: "FUTURES", order_id: orderId });

        signal.realized_pnl = Number(data.realized_pnl || "0");
        signal.state = "cancelled"

        await logSignal(signal, "Order has been cancelled successfully!");

        await signal.save();
    }

    async cancelOrderByClientId(signal: Signal) {

        await logSignal(signal, "Cancelling Order By client_id ...");
        const { data } = await Coinex.cancel_order_by_client_id({ market: signal.market, market_type: "FUTURES", client_id: signal._id.toString("hex") });

        signal.realized_pnl = Number(data.realized_pnl || "0");
        signal.state = "cancelled"

        await logSignal(signal, "Order has been cancelled successfully by client_id!");

        await signal.save();
    }
}

import { logSignal, Signal, Signals } from "../../models/Signal";
import { wait } from "../../utils/async";
import { DynamicConfigs } from "../../utils/config";
import { logger } from "../../utils/logger";
import { Coinex } from "../coinex";
import { CoinexHTTPError } from "../coinex/types/response";
import { TraderPosition } from "./components/position";
import { broadcast } from "../../ws";
import { getPositionTradingData } from "./utils/position";
import { Webhook } from "../hook";

export class LogicTrader extends TraderPosition {

    constructor() {
        super()
    }

    isApiReady() {

        const accessId = DynamicConfigs.get("CoinexAccessId");
        const secretKey = DynamicConfigs.get("CoinexSecretKey");
        const active = DynamicConfigs.get("active");

        return !!accessId && !!secretKey && active === 'true'
    }

    async incomeSignal(signal: Partial<Signal>) {
        try {
            Webhook.transmit({
                type: "new",
                messageId: signal.messageId as number,
                signal
            })
            const created = await Signals.create(signal);
            broadcast({ type: 'signal:new', payload: { _id: created._id, market: created.market, position: created.position, entry: created.entry, messageId: created.messageId } });
        } catch (err) {
            logger.error(err);
        }
    }

    async incomeUpdateSignal(messageId: number, signal: Partial<Signal>) {
        const signal_old = await Signals.findOne({ messageId });

        Webhook.transmit({
            type: "update",
            messageId: signal.messageId as number,
            signal
        })

        if (!signal_old || signal.state === 'cancelled' || signal.state === 'finished') return false;

        await this.destroyPosition(signal_old, true);

        const created = await Signals.create({ ...signal, messageId })
        broadcast({ type: 'signal:update', payload: { messageId, _id: created._id, market: created.market } });
    }

    async incomeDeleteSignal(messageId: number) {
        const signal_old = await Signals.findOne({ messageId });
        Webhook.transmit({
            type: "delete",
            messageId: messageId,
        })
        if (!signal_old || signal_old.state === 'cancelled' || signal_old.state === 'finished') return false;
        this.destroyPosition(signal_old);
        await logSignal(signal_old, "deleting signal due to income delete signal.")
        broadcast({ type: 'signal:delete', payload: { messageId } });
        return true
    }
    async incomeExitSignal(messageId: number) {
        const signal = await Signals.findOne({ messageId });
        Webhook.transmit({
            type: "delete",
            messageId: messageId,
        })
        if (!signal || signal.state === 'cancelled' || signal.state === 'finished') return false;
        await this.destroyPosition(signal);
        await logSignal(signal, "exiting from position due to the income exit signal!")
        broadcast({ type: 'signal:exit', payload: { messageId } });
        // add log
        return true
    }

    async destroyPosition(signal: Signal, deleteSignal?: boolean) {
        if (this.isApiReady()) {
            if (!signal.orderId && !signal.positionId) {
                await Signals.updateOne({ _id: signal._id }, { $set: { state: "cancelled" } })
            }
            if (signal.orderId && !signal.positionId)
                await this.cancelOrder(signal.orderId).catch(logger.error);

            if (signal.positionId)
                await this.closePosition(signal);

        } else {
            await Signals.updateOne({ _id: signal._id }, { $set: { state: "cancelled" } })
        }
        if (deleteSignal)
            await signal.deleteOne();
    }

    async placeSignalsAsOrder() {
        if (!this.isApiReady()) return
        const signals = await Signals.find({
            state: 'pending',
            createdAt: {
                $lte: new Date(Date.now() - (1e3 * 60 * 5)),
                $gte: new Date(Date.now() - (1e3 * 60 * 60))
            },
            error: { $exists: false }
        });


        for (let index = 0; index < signals.length; index++) {
            const signal = signals[index];

            try {
                await this.adjustLeverage(signal);
                await this.placeOrder(signal)
                broadcast({ type: 'signal:state', payload: { _id: signal._id, state: signal.state, orderId: signal.orderId, market: signal.market } });
            }
            catch (err: any) {
                logger.error(err);
                const coinexError: CoinexHTTPError = err;

                if (coinexError.code) {
                    if (coinexError?.code === 3008) {
                        await this.cancelOrderByClientId(signal);

                        signal.state = "pending";
                        await signal.save()
                    }
                    else {
                        signal.error = {
                            code: coinexError.code,
                            message: coinexError.message
                        }

                        await signal.save();
                    }
                }
                broadcast({ type: 'signal:error', payload: { _id: signal._id, market: signal.market, message: coinexError?.message || 'unknown error', code: coinexError?.code } });
            }

            await wait(.25)
        }
    }


    async checkOnOrders() {
        if (!this.isApiReady()) return
        const signals = await Signals.find({
            state: 'order placed',
            error: { $exists: false }
        });

        for (let index = 0; index < signals.length; index++) {
            const signal = signals[index];

            try {
                await this.getOrderStatus(signal)
            }
            catch (err: any) {
                logger.error(err);
            }

            await wait(.5)
        }
    }

    async checkOnCurrentPositions() {
        if (!this.isApiReady()) return
        const signals = await Signals.find({
            state: 'filled',
            positionId: { $exists: true },
            error: { $exists: false }
        });

        const positions = await this.getPendingPositions()
        for (let index = 0; index < signals.length; index++) {
            const signal = signals[index];

            const position = positions.find(x => x.position_id === signal.positionId)

            if (!position) continue;


            await Signals.updateOne({ _id: signal._id }, { $set: { realized_pnl: Number(position.unrealized_pnl) } })

            try {
                await this.setPositionSlAndTp(signal)
            } catch (err) {
                logger.error(err)
            }

            if (!signal.sl_tp_done) continue;

            const { stopLoss } = getPositionTradingData({ position, signal });

            if (!stopLoss) continue;

            await logSignal(signal, "moving stop loss to last check point! risk free!!!")
            await Coinex.set_position_stop_loss({
                market: signal.market,
                market_type: "FUTURES",
                stop_loss_price: stopLoss.toString(),
                stop_loss_type: "latest_price",
            })
            await logSignal(signal, `stop loss was moved from "${position.stop_loss_price}" to ${stopLoss}`)

            broadcast({ type: 'position:sl_moved', payload: { market: signal.market, positionId: signal.positionId, from: position.stop_loss_price, to: stopLoss } });

            await wait(.5)
        }
    }

}

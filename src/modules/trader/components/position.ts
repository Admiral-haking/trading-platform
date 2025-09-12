import { logSignal, Signal, Signals } from "../../../models/Signal";
import { wait } from "../../../utils/async";
import { logger } from "../../../utils/logger";
import { Coinex } from "../../coinex";
import { Market } from "../../market";
import { initialTpFromSignal } from "../utils/position";
import { TraderOrder } from "./order";
import { broadcast } from "../../../ws";

export class TraderPosition extends TraderOrder {

    constructor() {
        super();
    }

    async adjustLeverage(signal: Signal) {
        signal.leverage = Market.getLeverage({ market: signal.market, leverage: signal.leverage });

        await signal.save();


        await logSignal(signal, "adjusting position leverage in coinex...");

        const { data } = await Coinex.adjust_position_leverage({
            leverage: signal.leverage,
            margin_mode: "isolated",
            market: signal.market,
            market_type: "FUTURES"
        });


        await logSignal(signal, "leverage has been adjusted!");

        return data;
    }

    async closePosition(signal: Signal) {

        try {
            await logSignal(signal, "closing position...");

            const { data } = await Coinex.close_position({
                market: signal.market,
                market_type: "FUTURES",
                type: "market",
                client_id: signal._id.toString()
            })

            await logSignal(signal, "position closed successfully!");
            signal.state = 'finished';
            signal.realized_pnl = Number(data.realized_pnl);



            await signal.save();

            try {
                broadcast({ type: 'position:closed', payload: { _id: signal._id, market: signal.market, realized_pnl: signal.realized_pnl } });
            } catch { }
        }
        catch (err: any) {
            logger.error(err)

            await logSignal(signal, "closing failed: " + err.message);
        }
    }

    async setPositionSlAndTp(signal: Signal) {

        if (signal.sl_tp_done) return;


        await logSignal(signal, "setting SL & TP...");

        await Coinex.set_position_stop_loss({
            market: signal.market,
            market_type: "FUTURES",
            stop_loss_price: signal.stopLoss.toString(),
            stop_loss_type: "latest_price",
        })
        await Coinex.set_position_take_profit({
            market: signal.market,
            market_type: "FUTURES",
            take_profit_price: initialTpFromSignal(signal).toString(),
            take_profit_type: "latest_price",
        })


        await logSignal(signal, "setting SL & TP has been done!");

        signal.sl_tp_done = true;

        await signal.save()

    }


    async updateFinishedPositions() {
        const { data } = await Coinex.get_finished_positions({
            market_type: "FUTURES",
            limit: 100,
        });

        for (let index = 0; index < data.length; index++) {
            const position = data[index];

            await Signals.updateOne(
                { positionId: position.position_id },
                {
                    $set: {
                        state: "finished",
                        realized_pnl: Number(position.realized_pnl)
                    },
                    $push: {
                        logs: {
                            timestamp: Date.now(),
                            message: "updating position details done!"
                        }
                    }
                }
            );

            wait(.2);
        }
    }

    async getPendingPositions() {
        try {
            const { data } = await Coinex.get_pending_positions({ market_type: "FUTURES" });

            return data
        }
        catch (err) {
            logger.error(err)
            return []
        }
    }
}

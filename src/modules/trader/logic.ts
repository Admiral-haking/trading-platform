import { logSignal, Signal, Signals } from "../../models/Signal";
import { wait } from "../../utils/async";
import { DynamicConfigs } from "../../utils/config";
import { logger } from "../../utils/logger";
import { Coinex } from "../coinex";
import { CoinexHTTPError } from "../coinex/types/response";
import { TraderPosition } from "./components/position";
import { getPositionTradingData } from "./utils/position";

export class LogicTrader extends TraderPosition {

    constructor() {
        super()
    }

    isApiReady() {

        const accessId = DynamicConfigs.get("CoinexAccessId");
        const secretKey = DynamicConfigs.get("CoinexSecretKey");

        return !!accessId && !!secretKey
    }

    incomeSignal(signal: Partial<Signal>) {
        Signals.create(signal).catch(logger.error);
    }

    async incomeUpdateSignal(messageId: number, signal: Partial<Signal>) {
        const signal_old = await Signals.findOne({ messageId });
        if (!signal_old) return false;
        this.destroyPosition(signal_old, true);

        await Signals.create({ ...signal, messageId })
    }

    async incomeDeleteSignal(messageId: number) {
        const signal_old = await Signals.findOne({ messageId });
        if (!signal_old) return false;
        await logSignal(signal_old, "deleting signal due to telegram signal.")
        this.destroyPosition(signal_old);
        return true
    }
    async incomeExitSignal(messageId: number) {
        const signal = await Signals.findOne({ messageId });
        if (!signal) return false;
        await logSignal(signal, "exiting from position due to the telegram exit signal!")
        await this.destroyPosition(signal);
        // add log
        return true
    }

    async destroyPosition(signal: Signal, deleteSignal?: boolean) {
        if (this.isApiReady()) {
            if (signal.orderId && !signal.positionId)
                await this.cancelOrder(signal.orderId).catch(logger.error);

            if (signal.positionId)
                await this.closePosition(signal);
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

            await wait(.5)
        }
    }


}
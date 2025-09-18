import { Signal } from "../../../models/Signal";
import { DynamicConfigs } from "../../../utils/config";
import { PendingPosition } from "../../coinex/types/position";
import { Market } from "../../market";

type Props = { signal: Signal, position: PendingPosition }


export function getPositionTradingData({ position, signal }: Props) {
    const price = Market.getPrice(signal);

    const steps = [signal.entry, ...signal.takeProfit];

    for (let index = 0; index < steps.length; index++) {

        if (index <= 1) continue;

        const lastStep = steps[index - 2];
        const step = steps[index];
        if (signal.position === 'LONG') {

            if (price < step) break;

            const pst = Number(position.stop_loss_price);

            if (pst < lastStep) return { stopLoss: fivePercentBetween(lastStep, step) };
        } else {

            if (price > step) break;

            const pst = Number(position.stop_loss_price);

            if (pst > lastStep) return { stopLoss: fivePercentBetween(lastStep, step) };
        }
    }

    return {}

}

function fivePercentBetween(entry: number, tp1: number): number {
    const diff = tp1 - entry;         // distance between entry and tp1
    const fivePercent = diff * 0.05;  // 5% of that distance
    return entry + fivePercent;       // 5% closer to tp1 from entry
}

type TPStrategy = "fast-tp" | "risk-free"
export function initialTpFromSignal(signal: Signal) {
    const strategy: TPStrategy = DynamicConfigs.get("strategy") as TPStrategy;

    switch (strategy) {
        case "fast-tp": return signal.takeProfit[0];
        case "risk-free":
        default: return signal.takeProfit[signal.takeProfit.length - 1];
    }
}
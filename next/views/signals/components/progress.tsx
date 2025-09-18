import * as React from "react";
import { LinearProgress } from "@mui/material";

export type TradeProgressBarProps = {
    entryPrice: number;
    stopLoss: number;
    takeProfit: number;
    realizedPnl: number;
    amount: number;
    label?: string;
    priceDecimals?: number;
};

function clamp(n: number, min = 0, max = 100) {
    return Math.min(max, Math.max(min, n));
}

export default function TradeProgressBar({
    entryPrice,
    stopLoss,
    takeProfit,
    realizedPnl,
    amount,
}: TradeProgressBarProps) {
    const inferredDirection: "long" | "short" = React.useMemo(() => {
        if (takeProfit > entryPrice && stopLoss < entryPrice) return "long";
        if (takeProfit < entryPrice && stopLoss > entryPrice) return "short";
        // Fallback: compare TP to entry
        return takeProfit >= entryPrice ? "long" : "short";
    }, [entryPrice, stopLoss, takeProfit]);

    const canInfer = amount > 0 && Number.isFinite(amount) && Number.isFinite(realizedPnl);

    const currentPrice = React.useMemo(() => {
        if (!canInfer) return NaN;
        if (inferredDirection === "long") {
            return entryPrice + realizedPnl / amount;
        }
        // short
        return entryPrice - realizedPnl / amount;
    }, [canInfer, inferredDirection, entryPrice, realizedPnl, amount]);

    const isProfitSide = React.useMemo(() => {
        if (!Number.isFinite(currentPrice)) return false;
        return inferredDirection === "long"
            ? currentPrice >= entryPrice
            : currentPrice <= entryPrice;
    }, [currentPrice, inferredDirection, entryPrice]);

    // Distances
    const totalToTP = Math.abs(takeProfit - entryPrice);
    const totalToSL = Math.abs(stopLoss - entryPrice);
    const distToTP = Math.max(0, Math.abs(takeProfit - currentPrice));
    const distToSL = Math.max(0, Math.abs(stopLoss - currentPrice));

    // Remaining percent toward the relevant target from ENTRY
    const remainToTPPct = totalToTP > 0 ? clamp((distToTP / totalToTP) * 100) : 0;
    const remainToSLPct = totalToSL > 0 ? clamp((distToSL / totalToSL) * 100) : 0;

    // We fill the bar as we get CLOSER to the target (i.e., achieved = 100 - remaining)
    const showingTP = isProfitSide; // success mode shows TP; error mode shows SL
    const remainingPct = showingTP ? remainToTPPct : remainToSLPct;
    const achievedPct = 100 - remainingPct;

    const color: "success" | "error" = showingTP ? "success" : "error";




    return (
        <LinearProgress
            variant={canInfer ? "determinate" : "indeterminate"}
            value={canInfer ? achievedPct : undefined}
            color={color}
            sx={{ borderRadius: 5 }}
        />
    );
}

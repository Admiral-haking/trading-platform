import { Signals } from "../../../models/Signal";
import { DynamicConfigs } from "../../../utils/config";
import { logger } from "../../../utils/logger";
import { Coinex } from "../../coinex";
import type { SpotBalanceRecord } from "../../coinex/types/spot"
import { clampPercent } from "../utils/compare";

export class TraderBalance {
    spotAssets: SpotBalanceRecord[] = [];

    featuresUSDTBalance: number = 0;
    spotUSDTBalance: number = 0;

    featuresUSDTFrozenBalance: number = 0;
    spotUSDTFrozenBalance: number = 0;

    fullFeatureBalance: number = 0
    WorkingCapital: number = 0;

    eachTraderAmount: number = 0;


    constructor() {
        this.updateBalances()
        setInterval(() => {
            this.updateBalances()
        }, 1e3 * 60 * 2);
    }

    async updateBalances() {

        const accessId = DynamicConfigs.get("CoinexAccessId");
        const secretKey = DynamicConfigs.get("CoinexSecretKey");
        if (!accessId || !secretKey) {
            logger.warn("Coinex credentials missing; skipped updateBalances()");
            return;
        }

        try {
            const { data: spot } = await Coinex.spot_balance();
            this.spotAssets = spot;

            const spotUsdt = (Array.isArray(spot) ? spot : []).find(x => x?.ccy === "USDT");
            this.spotUSDTBalance = Number(spotUsdt?.available ?? 0) || 0;
            this.spotUSDTFrozenBalance = Number(spotUsdt?.frozen ?? 0) || 0;

            const { data: features } = await Coinex.features_balance();


            const featuresUsdt = (Array.isArray(features) ? features : []).find(x => x?.ccy === "USDT");


            this.featuresUSDTBalance = Number(featuresUsdt?.available ?? 0) || 0;
            this.featuresUSDTFrozenBalance = Number(featuresUsdt?.frozen ?? 0) || 0;
            const unrealized_pnl = Number(featuresUsdt?.unrealized_pnl ?? 0) || 0;

            const signals = await Signals.find({ state: 'filled' });

            const sum = signals.reduce((t, c) => {
                if (!c.coinex_position || !("avg_entry_price" in c.coinex_position) || !("ath_position_amount" in c.coinex_position)) return t;
                const price = Number(c.coinex_position.avg_entry_price || "0") || 0;
                const amount = Number(c.coinex_position.ath_position_amount || "0") || 0
                return t + ((amount * price) / c.leverage)
            }, 0)
            // As you intended: total USDT on the account (available + frozen)
            this.fullFeatureBalance = this.featuresUSDTBalance + this.featuresUSDTFrozenBalance + sum + unrealized_pnl;


            // Read, sanitize, and clamp percentages
            const wcp = clampPercent(DynamicConfigs.get("workingCapitalPercentage"), 50); // e.g., 80
            const etp = clampPercent(DynamicConfigs.get("eachTradePercentage"), 10);      // e.g., 10

            // Predictable, monotonic rounding: floor at each step
            this.WorkingCapital = Math.max(0, Math.floor((this.fullFeatureBalance * wcp) / 100));
            this.eachTraderAmount = Math.max(0, Math.floor((this.WorkingCapital * etp) / 100));
            // (Equivalently: Math.floor(this.fullFeatureBalance * wcp * etp / 10_000))

        } catch (err) {
            logger.error("updateBalances() failed:", err);
        }

    }

}
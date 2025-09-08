import { DynamicConfigs } from "../../../utils/config";
import { logger } from "../../../utils/logger";
import { Coinex } from "../../coinex";
import type { SpotBalanceRecord } from "../../coinex/types/spot"

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
        }, 1e3 * 60 * 5);
    }

    async updateBalances() {

        const accessId = DynamicConfigs.get("CoinexAccessId");
        const secretKey = DynamicConfigs.get("CoinexSecretKey");

        if (!accessId || !secretKey) return;

        try {
            const { data: spot } = await Coinex.spot_balance();

            this.spotAssets = spot;

            const spotUsdt = spot.find(x => x.ccy === "USDT")
            this.spotUSDTBalance = Number(spotUsdt?.available || "0");
            this.spotUSDTFrozenBalance = Number(spotUsdt?.frozen || "0")

            const { data: features } = await Coinex.features_balance();

            const featuresUsdt = (features || []).find(x => x.ccy === 'USDT')

            this.featuresUSDTBalance = Number(featuresUsdt?.available || "0");
            this.featuresUSDTFrozenBalance = Number(featuresUsdt?.frozen || "0");

            this.fullFeatureBalance = this.featuresUSDTBalance + this.featuresUSDTFrozenBalance;


            const wcp = Number(DynamicConfigs.get("workingCapitalPercentage") || "50");
            const etp = Number(DynamicConfigs.get("eachTradePercentage") || "10");

            const ffbUnit = this.fullFeatureBalance / 100;

            this.WorkingCapital = Math.ceil(ffbUnit * wcp);

            const wcUnit = this.WorkingCapital / 100;

            this.eachTraderAmount = Math.trunc(wcUnit * etp)
        }
        catch (err) {
            logger.error(err)
        }

    }

}
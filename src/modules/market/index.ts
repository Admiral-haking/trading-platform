import { subscribeMarket } from "./components/market-data"
import { Markets } from "./components/types"
import { GetLeverageParams, GetPriceParams } from "./types"

class FeaturesMarket {

    initiated: boolean = false

    updateTime: number = Date.now()

    markets: Markets = {}

    subscriber = subscribeMarket(_markets => this.markets = _markets);

    constructor() {
        setInterval(this.subscriber.fetch, 1e3);
    }

    getPrice({ market }: GetPriceParams) {
        try {
            return Number(this.markets[market].last)
        }
        catch {
            return -1;
        }
    }

    hasMarket({ market }: GetPriceParams) {
        try {
            return Boolean(this.markets[market])
        }
        catch {
            return false;
        }
    }

    getLeverage({ market, leverage }: GetLeverageParams) {
        try {
            const leverages = this.markets[market].leverage.map(Number);
            const l = Number(leverage);

            const exact = leverages.find(x => x === l);

            if (exact) return exact;

            for (let index = 0; index < leverages.length; index++) {
                const prev = leverages[index - 1] || leverages[0];
                const current = leverages[index];
                if (l > prev && l < current) return prev;
            }

            return leverages[0]
        }
        catch {
            return -1;
        }
    }
}


export const Market = new FeaturesMarket();
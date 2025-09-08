import { Markets, MarketPairStatus } from "./types";
import { Coinex } from "../../coinex";

type MarketSubscriber = (market: Markets) => void


export function subscribeMarket(subscriber: MarketSubscriber) {
    const statuses: MarketPairStatus[] = [];

    Coinex.features_market()
        .then(res => {
            statuses.push(...res.data)
        })
        .catch(console.error)

    return {
        fetch: () => {
            Coinex.features_ticker()
                .then(({ data: tickers }) => {
                    const market: Markets = {};


                    for (let index = 0; index < tickers.length; index++) {
                        const ticker = tickers[index];
                        const status = statuses.find(x => x.market === ticker.market) || {} as MarketPairStatus;

                        market[ticker.market] = {
                            ...ticker,
                            ...status
                        }
                    }

                    subscriber(market);
                })
                .catch(console.error)
        }
    }
}
import { Signals } from "../../../models/Signal"
import { Market } from "../../../modules/market"
import { Trader } from "../../../modules/trader"

export const coinexFullDataHandler: Handler = async (req, res, next) => {
    try {
        res.json({
            assets: Trader.spotAssets,
            spotAvailableUSDT: Trader.spotUSDTBalance,
            spotFrozenUSDT: Trader.spotUSDTFrozenBalance,
            featuresAvailableUSDT: Trader.fullFeatureBalance,
            featuresFrozenUSDT: Trader.featuresUSDTFrozenBalance,
            markets: Market.markets,
            signals: await Signals.find({}, null, { sort: { _id: -1 } })
        })
    }
    catch (err) {
        next(err)
    }
}
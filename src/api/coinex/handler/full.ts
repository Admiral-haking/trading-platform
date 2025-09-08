import { Signals } from "../../../models/Signal"
import { Market } from "../../../modules/market"
import { Trader } from "../../../modules/trader"

export const coinexFullDataHandler: Handler = async (req, res, next) => {
    try {
        res.json({
            assets: Trader.spotAssets,
            spotAvailableUSDT: Trader.spotUSDTBalance,
            spotFrozenUSDT: Trader.spotUSDTFrozenBalance,
            featuresAvailableUSDT: Trader.featuresUSDTBalance,
            featuresFrozenUSDT: Trader.featuresUSDTFrozenBalance,
            markets: Market.markets,
            signals: await Signals.find({ state: { $ne: "cancelled" } })
        })
    }
    catch (err) {
        next(err)
    }
}
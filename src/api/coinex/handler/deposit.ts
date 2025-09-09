import { Coinex } from "../../../modules/coinex";
import { Trader } from "../../../modules/trader";
import { wait } from "../../../utils/async";
import { logger } from "../../../utils/logger";

export const depositAddressesHandler: Handler = async (req, res, next) => {
    try {
        const { ccy } = req.params;

        const coinInfo = await Coinex.get_coin_info({ ccy });

        const info = coinInfo.data.find(x => x.short_name === ccy);

        const chains = info?.chain_info.map(x => x.chain_name) || [];

        const addresses: Record<string, string> = {};

        for (let index = 0; index < chains.length; index++) {
            const chain = chains[index];

            try {

                addresses[chain] = (await Coinex.get_deposit_address({ ccy, chain })).data.address;
            }
            catch (err) {
                logger.error(chain, err)
            }

            await wait(.2);
        }

        res.json(addresses)
    }
    catch (err) {
        console.log(err);

        next(err);
    }
}
export const depositHistoryHandler: Handler = async (req, res, next) => {
    try {
        const history = await Trader.getDepositHistory();

        res.json(history)
    }
    catch (err) {
        next(err);
    }
}
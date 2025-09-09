import { TransferRequest } from "../../../modules/coinex/types/transfer";
import { Trader } from "../../../modules/trader";

export const internalTransferHandler: Handler = async (req, res, next) => {
    try {
        const args: TransferRequest = req.body;

        const response = await Trader.transfer(args);

        res.json(response)
    }
    catch (err) {
        next(err);
    }
}
export const withdrawalHistoryHandler: Handler = async (req, res, next) => {
    try {
        const response = await Trader.getWithdrawals()

        res.json(response)
    }
    catch (err) {
        next(err);
    }
}
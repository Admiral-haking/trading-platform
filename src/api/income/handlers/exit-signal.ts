import { Trader } from "../../../modules/trader";

export const incomeExitSignal: Handler = async (req, res, next) => {
    try {
        await Trader.incomeExitSignal(Number(req.params.messageId));
        res.status(201).json({ status: "OK" });
    } catch (err) {
        next(err)
    }
}
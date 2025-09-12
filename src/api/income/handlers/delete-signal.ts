import { Trader } from "../../../modules/trader";

export const incomeDeleteSignal: Handler = async (req, res, next) => {
    try {
        await Trader.incomeDeleteSignal(Number(req.params.messageId));
        res.status(201).json({ status: "OK" });
    } catch (err) {
        next(err)
    }
}
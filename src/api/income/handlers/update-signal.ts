import { Trader } from "../../../modules/trader";

export const incomeUpdateSignal: Handler = async (req, res, next) => {
    try {
        await Trader.incomeUpdateSignal(req.body.messageId, req.body);
        res.status(201).json({ status: "OK" });
    } catch (err) {
        next(err)
    }
}
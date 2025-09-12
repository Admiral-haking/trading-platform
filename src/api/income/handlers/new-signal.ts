import { Trader } from "../../../modules/trader";

export const incomeNewSignal: Handler = async (req, res, next) => {
    try {
        await Trader.incomeSignal(req.body);
        res.status(201).json({ status: "OK" });
    } catch (err) {
        next(err)
    }
}
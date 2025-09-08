import { logSignal, Signals } from "../../../models/Signal";
import { Trader } from "../../../modules/trader";

export const coinexClosePositionHandler: Handler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const signal = await Signals.findById(id);

        if (!signal) return res.status(404).send();

        await logSignal(signal, "Closed By User.")
        await Trader.destroyPosition(signal);

        res.status(201).send()
    }
    catch (err) {
        next(err)
    }
}
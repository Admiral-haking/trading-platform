import { z } from "zod";

export const zodSignalSchema = z.object({
    market: z
        .string()
        .regex(/^[A-Z]+USDT$/, { message: "Market must end with USDT" }),

    entry: z.number(),

    position: z.enum(["LONG", "SHORT"]),

    stopLoss: z.number(),

    takeProfit: z.array(z.number()).nonempty(),

    leverage: z.number().min(1),

    messageId: z.number(),
});

export const incomeValidationMiddleware: Handler = async (req, res, next) => {
    try {
        req.body = await zodSignalSchema.parseAsync(req.body)
        next();
    }
    catch (err) {
        res.status(400).send(err)
    }
}

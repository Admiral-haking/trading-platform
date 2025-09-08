// npm i zod
import { z } from "zod";
import { LLMReturnType } from "../components/types";

// ----- Schema (strict) -----
const Schema = z.object({
    market: z.string(),
    entry: z.number(),
    position: z.enum(["LONG", "SHORT"]),
    stopLoss: z.number(),
    takeProfit: z.array(z.number()).nonempty(),
    leverage: z.number().max(35)
}).strict();

type Ok = { status: "ok"; data: LLMReturnType };
type Warn = { status: "warn" };
type Err = { status: "error" };
export type ValidationResult = Ok | Warn | Err;

// ----- Utils -----
const toNumber = (n: unknown): number | null => {
    if (typeof n === "number" && Number.isFinite(n)) return n;
    if (typeof n === "string") {
        const cleaned = n.replace(/[,\s]/g, "");
        const v = Number(cleaned);
        return Number.isFinite(v) ? v : null;
    }
    return null;
};

const normalizeMarket = (mkt: string): string => mkt.trim().toUpperCase().replace(/[^\w]/g, "");

// Core consistency checks producing "warn"
function hasNumberingContradictions(d: LLMReturnType): boolean {
    const { position, entry, stopLoss, takeProfit } = d;

    // 50% SL distance rule
    const tooFarSL = Math.abs(stopLoss - entry) > 0.5 * entry;

    // Directional logic
    const maxTP = Math.max(...takeProfit);
    const minTP = Math.min(...takeProfit);

    const longBad =
        position === "LONG" &&
        (
            entry >= maxTP ||              // entry must be below at least one TP
            !(takeProfit.some(tp => tp > entry)) ||
            !(takeProfit.every(tp => tp > stopLoss)) // TP should be above SL in LONG
        );

    const shortBad =
        position === "SHORT" &&
        (
            entry <= minTP ||              // entry must be above at least one TP
            !(takeProfit.some(tp => tp < entry)) ||
            !(takeProfit.every(tp => tp < stopLoss)) // TP should be below SL in SHORT
        );

    return tooFarSL || longBad || shortBad;
}

// ----- Public validator -----
// Accepts anything the LLM returned (object), re-validates & enforces rules.
export function validateLLMOutput(raw: unknown): ValidationResult {
    // Quick unrelated / missing check
    if (!raw || typeof raw !== "object") return { status: "error" };

    // Coerce minor types (e.g., strings-as-numbers) *before* Zod strict check
    const obj: any = { ...(raw as Record<string, unknown>) };

    if (typeof obj.market === "string") {
        obj.market = normalizeMarket(obj.market);
        // normalize X/USDT -> XUSDT, BTC-USDT -> BTCUSDT
        obj.market = obj.market.replace(/USDT$/, "") + "USDT";
    }

    if (obj.entry !== undefined) obj.entry = toNumber(obj.entry);
    if (obj.stopLoss !== undefined) obj.stopLoss = toNumber(obj.stopLoss);
    if (Array.isArray(obj.takeProfit)) obj.takeProfit = obj.takeProfit.map(toNumber).filter((n: any) => n !== null);

    // Enforce required fields exist
    if (
        typeof obj.market !== "string" ||
        obj.market.length === 0 ||
        !obj.market.endsWith("USDT") ||
        obj.entry === null ||
        obj.stopLoss === null ||
        !Array.isArray(obj.takeProfit) ||
        obj.takeProfit.length === 0 ||
        (obj.position !== "LONG" && obj.position !== "SHORT")
    ) {
        return { status: "error" };
    }

    // Final schema check (ensures finite numbers, correct enums, no extra fields)
    const parsed = Schema.safeParse(obj);
    if (!parsed.success) return { status: "error" };

    const data = parsed.data;

    // Business-rule sanity (warn on contradictions / human typos)
    if (hasNumberingContradictions(data)) {
        return { status: "warn" };
    }

    return { status: "ok", data };
}

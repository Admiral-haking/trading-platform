import { MarketPairStatus, MarketTicker } from "../../coinex/types/market";

type Ok =
    | {
        ok: true;
        amount: number;          // base units/contracts (floored to precision)
        amountStr: string;       // formatted for API
        price: number;           // user price rounded down to tick_size
        priceStr: string;        // formatted for API
        notional: number;        // amount * price
        priceAdjusted: boolean;  // true if we had to floor to tick
    };

type Fail =
    | { ok: false; reason: 'PRICE_INVALID' }
    | { ok: false; reason: 'AMOUNT_ZERO' }
    | { ok: false; reason: 'AMOUNT_TOO_SMALL' };

export type SizeResultLimit = Ok | Fail;

export function sizeOrderFromNotionalLimit(args: {
    targetNotionalUSDT: number;
    price: number;                       // your desired LIMIT price (USDT)
    marketFullStatus: MarketPairStatus & MarketTicker;  // from your cache
}): SizeResultLimit {
    const { targetNotionalUSDT, marketFullStatus: m } = args;
    let { price } = args;

    // --- parse numeric fields from strings
    const tickSize = toNum(m.tick_size);
    const minAmount = toNum(m.min_amount);
    const basePrec = m.base_ccy_precision ?? 0;
    const quotePrec = m.quote_ccy_precision ?? 8;

    if (!(price > 0)) return { ok: false, reason: 'PRICE_INVALID' };

    // --- always round price DOWN to tick_size
    const flooredPrice = tickSize > 0 ? floorToStep(price, tickSize) : price;
    if (!(flooredPrice > 0)) return { ok: false, reason: 'PRICE_INVALID' };
    const priceAdjusted = flooredPrice !== price;
    price = flooredPrice;

    // --- compute amount from notional and floor to base precision
    const rawAmount = targetNotionalUSDT / price;
    const amount = floorToDecimals(rawAmount, basePrec);

    if (!(amount > 0)) return { ok: false, reason: 'AMOUNT_ZERO' };
    if (amount + 1e-12 < minAmount) return { ok: false, reason: 'AMOUNT_TOO_SMALL' };

    const notional = amount * price;

    return {
        ok: true,
        amount,
        amountStr: toFixedSafe(amount, basePrec),
        price,
        priceStr: toFixedSafe(price, quotePrec),
        notional,
        priceAdjusted
    };
}

/* ---------------- helpers ---------------- */

function toNum(x: string | number | undefined | null): number {
    if (typeof x === 'number') return x;
    if (typeof x === 'string') return Number(x);
    return NaN;
}

function floorToStep(x: number, step: number): number {
    if (!(step > 0)) return x;
    return Math.floor(x / step) * step;
}

function floorToDecimals(x: number, decimals: number): number {
    const f = Math.pow(10, Math.max(0, decimals | 0));
    return Math.floor(x * f) / f;
}

function toFixedSafe(x: number, decimals: number): string {
    return (Math.round(x * Math.pow(10, decimals)) / Math.pow(10, decimals)).toFixed(decimals);
}

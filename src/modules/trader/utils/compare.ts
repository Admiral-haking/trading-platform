export function compareBasedOnSide(side: "LONG" | "SHORT", last: number, entry: number) {
    if (side === 'LONG') return last > entry;
    return last < entry;
}

export function clampPercent(n: string, fallback: number): number {
    const num = Number(n);
    if (!Number.isFinite(num)) return fallback;
    return Math.min(100, Math.max(0, num));
}
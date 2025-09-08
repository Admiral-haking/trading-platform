export interface LLMReturnType {
    market: string // the symbol name like BTCUSDT - it should always be with USDT at the end of it
    entry: number
    position: "LONG" | "SHORT"
    stopLoss: number
    takeProfit: number[]
    leverage: number
}

export interface LLMOrderReturnType {
    order: "exit" | "continue"
}
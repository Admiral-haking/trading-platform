// Reuse types
type MarketTypeFutures = "FUTURES";
type MarginMode = "isolated" | "cross";

// Request
export interface AdjustPositionLeverageRequest {
    market: string;                 // Market name
    market_type: MarketTypeFutures; // Must be "FUTURES"
    margin_mode: MarginMode;        // Position type
    leverage: number;               // Leverage ratio
}

// Response
export interface AdjustPositionLeverageResult {
    margin_mode: MarginMode;
    leverage: number;
}

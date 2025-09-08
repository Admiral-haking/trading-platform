// Shared unions
type MarketTypeFutures = "FUTURES";
type MarginMode = "isolated" | "cross";
type PositionSide = "long" | "short";
type TriggerPriceType = "latest_price" | "mark_price";

// Request
export interface SetPositionStopLossRequest {
    market: string;                  // Market name
    market_type: MarketTypeFutures;  // Must be "FUTURES"
    stop_loss_type: TriggerPriceType;// Trigger price type
    stop_loss_price: string;         // Stop-loss price
}

// Response item
export interface PositionSnapshot {
    position_id: number;
    market: string;
    market_type: MarketTypeFutures;
    side: PositionSide;
    margin_mode: MarginMode;

    open_interest: string;
    close_avbl: string;
    ath_position_amount: string;

    unrealized_pnl: string;
    realized_pnl: string;

    avg_entry_price: string;
    cml_position_value: string;
    max_position_value: string;

    take_profit_price: string;
    stop_loss_price: string;
    take_profit_type: TriggerPriceType;
    stop_loss_type: TriggerPriceType;

    leverage: number;                // per docs for this endpoint
    margin_avbl: string;
    ath_margin_size: string;
    position_margin_rate: string;

    maintenance_margin_rate: string;
    maintenance_margin_value: string;

    liq_price: string;
    bkr_price: string;

    adl_level: number;               // 1..5
    settle_price: string;
    settle_value: string;

    created_at: number;
    updated_at: number;
}



// Request
export interface SetPositionTakeProfitRequest {
    market: string;                   // Market name
    market_type: MarketTypeFutures;   // Must be "FUTURES"
    take_profit_type: TriggerPriceType; // Trigger price type
    take_profit_price: string;        // Take-profit price
}

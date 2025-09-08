type OrderSide = "buy" | "sell";
type MarketType = "SPOT" | "MARGIN" | "FUTURES";
type OrderType = "limit" | "market";

interface BaseOrderRequest {
    market: string;
    market_type: MarketType;
    side: OrderSide;
    type: OrderType;
    amount: string;
    client_id?: string;
    is_hide?: boolean;
}

interface LimitOrderRequest extends BaseOrderRequest {
    type: "limit";
    price: string;
}

interface MarketOrderRequest extends BaseOrderRequest {
    type: "market";
    price?: never; // price not allowed in market orders
}

export type OrderRequest = LimitOrderRequest | MarketOrderRequest;
export interface OrderRecord {
    order_id: number;
    market: string;
    market_type: MarketType;
    side: OrderSide;
    type: OrderType;
    amount: string;
    price: string;
    unfilled_amount: string;
    filled_amount: string;
    filled_value: string;
    client_id: string;
    fee: string;
    fee_ccy: string;
    maker_fee_rate: string;
    taker_fee_rate: string;
    last_filled_amount: string;
    last_filled_price: string;
    realized_pnl: string;
    created_at: number;
    updated_at: number;
}

export interface OrderStatusParams {
    market: string
    order_id: number | string
}

type OrderStatus =
    | "open"
    | "part_filled"
    | "filled"
    | "part_canceled"
    | "canceled";

export interface OrderStatusRecord {
    order_id: number;
    market: string;
    market_type: MarketType;
    side: OrderSide;
    type: OrderType;
    amount: string;
    price: string;
    unfilled_amount: string;
    filled_amount: string;
    filled_value: string;
    client_id: string;
    fee: string;
    fee_ccy: string;
    maker_fee_rate: string;
    taker_fee_rate: string;
    last_filled_amount: string;
    last_filled_price: string;
    realized_pnl: string;
    created_at: number;
    updated_at: number;
    status: OrderStatus;
}

export interface CancelOrderRequest {
    market: string;
    market_type: MarketType; // "SPOT" | "MARGIN" | "FUTURES"
    order_id?: number;
}
export interface CancelOrderByClientIdRequest {
    market?: string;
    market_type: MarketType; // "SPOT" | "MARGIN" | "FUTURES"
    client_id: string;
}

// Cancel order response (same as OrderRecord, but may not always include status)
export type CancelOrderResponse = OrderRecord;
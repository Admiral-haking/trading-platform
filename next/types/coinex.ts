// Types mirrored from backend d.ts shapes
export type SpotBalanceRecord = {
  ccy: string;
  available: string;
  frozen: string;
};

export type MarketPairStatus = {
  base_ccy: string;
  base_ccy_precision: number;
  contract_type: string;
  is_copy_trading_available: boolean;
  is_market_available: boolean;
  leverage: string[];
  maker_fee_rate: string;
  market: string;
  min_amount: string;
  open_interest_volume: string;
  quote_ccy: string;
  quote_ccy_precision: number;
  status: string;
  taker_fee_rate: string;
  tick_size: string;
};

export type MarketTicker = {
  market: string;
  last: string;
  open: string;
  close: string;
  high: string;
  low: string;
  volume: string;
  volume_sell: string;
  volume_buy: string;
  value: string;
  index_price: string;
  mark_price: string;
  open_interest_volume: string;
  period: number;
};

export type Markets = Record<string, MarketPairStatus & MarketTicker>;

export type SignalState = 'pending' | 'order placed' | 'filled' | 'cancelled' | 'finished';
export type Signal = {
  _id?: string;
  market: string;
  entry: number;
  position: 'LONG' | 'SHORT';
  stopLoss: number;
  takeProfit: number[];
  leverage: number;
  messageId: number;
  orderId?: number;
  positionId?: number;
  state: SignalState;
  realized_pnl: number;
  sl_tp_done: boolean;
  createdAt: string;
  updatedAt: string;
  error?: { message: string; code: number };
  logs: { timestamp: number; message: string }[];

  coinex_position?: PendingPosition | ClosePositionResult | FinishedPosition
};

export type CoinexFullResponse = {
  assets: SpotBalanceRecord[];
  spotAvailableUSDT: number;
  spotFrozenUSDT: number;
  featuresAvailableUSDT: number;
  featuresFrozenUSDT: number;
  markets: Markets;
  signals: Signal[];
};

type MarketTypeFutures = "FUTURES";
type OrderType = "limit" | "market";
type OrderSide = "buy" | "sell"; // returned by API
type STPMode = "ct" | "cm" | "both";
type MarginMode = "isolated" | "cross";
type TriggerPriceType = "latest_price" | "mark_price";

// Request
export interface ClosePositionRequest {
  market: string;                 // Market name
  market_type: MarketTypeFutures; // Must be "FUTURES"
  type: OrderType;                // "limit" | "market"
  price?: string;                 // Required when type === "limit"
  amount?: string | null;         // null to close ALL positions
  client_id?: string;             // up to 32 bytes, [A-Za-z0-9_-]
  is_hide?: boolean;              // default: false
  stp_mode?: STPMode;             // self-trade protection
}

// Response (shape per docs; status not included)
export interface ClosePositionResult {
  order_id: number;
  market: string;
  market_type: MarketTypeFutures;
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

export interface PendingPositionQuery {
  market?: string;                // Market name
  market_type: MarketTypeFutures; // Must be "FUTURES"
  page?: number;                  // default: 1
  limit?: number;                 // default: 10
}

// One position item (API returns most numerics as strings for precision)
export interface PendingPosition {
  position_id: number;              // int
  market: string;
  market_type: MarketTypeFutures;
  side: string;                     // e.g., "long" | "short" (kept as string)
  margin_mode: MarginMode;

  open_interest: string;            // position size
  close_avbl: string;               // amount available to close
  ath_position_amount: string;

  unrealized_pnl: string;
  realized_pnl: string;

  avg_entry_price: string;
  cml_position_value: string;       // cumulative position value
  max_position_value: string;

  take_profit_price: string;
  stop_loss_price: string;
  take_profit_type: string;         // trigger price type (e.g., latest/mark)
  stop_loss_type: string;           // trigger price type (e.g., latest/mark)

  leverage: string;                 // leverage shown as string by API
  margin_avbl: string;              // available margin
  ath_margin_size: string;
  position_margin_rate: string;

  maintenance_margin_rate: string;
  maintenance_margin_value: string;

  liq_price: string;                // liquidation price
  bkr_price: string;                // bankruptcy price

  adl_level: number;                // 1..5
  settle_price: string;             // mark-price-based
  settle_value: string;             // mark-price-based

  created_at: number;               // int timestamp
  updated_at: number;               // int timestamp
}



// Request
export interface FinishedPositionQuery {
  market?: string;                 // Market name
  market_type: MarketTypeFutures;  // Must be "FUTURES"
  start_time?: number;             // unix ms (no filter if omitted)
  end_time?: number;               // unix ms (no filter if omitted)
  page?: number;                   // default: 1
  limit?: number;                  // default: 10
}

// Response item
export interface FinishedPosition {
  position_id: number;
  market: string;
  market_type: MarketTypeFutures;
  side: OrderType;
  margin_mode: MarginMode;

  finished_type: string;           // closing type (kept as string)

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

  leverage: number;                // int per docs
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

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

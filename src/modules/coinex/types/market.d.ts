export interface MarketPairStatus {
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
}
export interface MarketTicker {
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
}
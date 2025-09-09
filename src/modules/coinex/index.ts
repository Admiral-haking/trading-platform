import { Get, Post } from "./utils/axios";

import type { MarketPairStatus, MarketTicker } from "./types/market";
import type { SpotBalanceRecord } from "./types/spot";
import type { FeaturesBalanceRecord } from "./types/features";
import type { CoinInfoParams, DepositAddress, DepositAddressParams, DepositQueryParams, DepositRecord, TokenInfo } from "./types/deposit";
import type { WithdrawalQueryParams, WithdrawalQueryRecord, WithdrawalRecord, WithdrawalRequest } from "./types/withdraw";
import type { TransferRequest } from "./types/transfer";
import type { CancelOrderByClientIdRequest, CancelOrderRequest, CancelOrderResponse, OrderRecord, OrderRequest, OrderStatusParams, OrderStatusRecord } from "./types/order";
import type { ClosePositionRequest, ClosePositionResult, FinishedPosition, FinishedPositionQuery, PendingPosition, PendingPositionQuery } from "./types/position";
import type { AdjustPositionLeverageRequest } from "./types/leverage";
import type { PositionSnapshot, SetPositionStopLossRequest, SetPositionTakeProfitRequest } from "./types/sl-tp";

export const Coinex = {
    features_market: () => Get<MarketPairStatus[]>("/futures/market"),
    features_ticker: () => Get<MarketTicker[]>("/futures/ticker"),
    spot_balance: () => Get<SpotBalanceRecord[]>("/assets/spot/balance"),
    features_balance: () => Get<FeaturesBalanceRecord[]>("/assets/futures/balance"),
    get_deposit_address: (params: DepositAddressParams) => Get<DepositAddress>("/assets/deposit-address", { params }),
    get_coin_info: (params: CoinInfoParams) => Get<TokenInfo[]>("/assets/info", { params }),
    get_deposit_history: (params: DepositQueryParams) => Get<DepositRecord[]>("/assets/deposit-history", { params }),
    withdrawal: (params: WithdrawalRequest) => Post<WithdrawalRecord>("/assets/withdraw", params),
    get_withdrawal_history: (params: WithdrawalQueryParams) => Get<WithdrawalQueryRecord[]>("/assets/withdraw", { params }),
    transfer: (params: TransferRequest) => Post<string>("/assets/transfer", params),
    place_order: (params: OrderRequest) => Post<OrderRecord>("/futures/order", params),
    get_order_status: (params: OrderStatusParams) => Get<OrderStatusRecord>("/futures/order-status", { params }),
    cancel_order: (params: CancelOrderRequest) => Post<CancelOrderResponse>("/futures/cancel-order", params),
    cancel_order_by_client_id: (params: CancelOrderByClientIdRequest) => Post<CancelOrderResponse>("/futures/cancel-order", params),
    close_position: (params: ClosePositionRequest) => Post<ClosePositionResult>("/futures/close-position", params),
    adjust_position_leverage: (params: AdjustPositionLeverageRequest) => Post<AdjustPositionLeverageRequest>("/futures/adjust-position-leverage", params),
    get_pending_positions: (params: PendingPositionQuery) => Get<PendingPosition[]>("/futures/pending-position", { params }),
    set_position_stop_loss: (params: SetPositionStopLossRequest) => Post<PositionSnapshot>("/futures/set-position-stop-loss", params),
    set_position_take_profit: (params: SetPositionTakeProfitRequest) => Post<PositionSnapshot>("/futures/set-position-take-profit", params),
    get_finished_positions: (params: FinishedPositionQuery) => Get<FinishedPosition[]>("/futures/finished-position", { params })
};
import { MarketPairStatus, MarketTicker } from "../../coinex/types/market";

export * from "../../coinex/types/market";

export type Markets = Record<string, MarketPairStatus & MarketTicker>
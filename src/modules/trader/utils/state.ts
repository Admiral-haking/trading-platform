import { SignalState } from "../../../models/Signal";
import { OrderStatus } from "../../coinex/types/order";

export function orderStateToSignalState(state: OrderStatus): SignalState {
    switch (state) {
        case "filled": return "filled"
        case "part_canceled":
        case "canceled": return "cancelled"
        case "open":
        case "part_filled":
        default: return "order placed"
    }
}
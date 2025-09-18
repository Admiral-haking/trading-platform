import { Document, model, Schema, Types } from "mongoose";
import { LLMReturnType } from "../modules/LLM/components/types";
import { ClosePositionResult, FinishedPosition, PendingPosition } from "../modules/coinex/types/position";


export type SignalState = 'pending' | 'order placed' | 'filled' | 'cancelled' | 'finished'
export interface Signal extends Document<Types.ObjectId>, LLMReturnType {
    messageId: number

    orderId?: number

    positionId?: number

    state: SignalState

    realized_pnl: number

    sl_tp_done: boolean

    createdAt: Date;
    updatedAt: Date;

    error?: {
        message: string
        code: number
    }

    logs: {
        timestamp: number
        message: string
    }[]

    coinex_position?: PendingPosition | ClosePositionResult | FinishedPosition
}


const SignalSchema: Schema = new Schema<Signal>(
    {
        market: {
            type: String,
            required: true,
            match: /^[A-Z]+USDT$/, // enforce that market ends with USDT
        },
        entry: {
            type: Number,
            required: true,
        },
        position: {
            type: String,
            enum: ["LONG", "SHORT"],
            required: true,
        },
        stopLoss: {
            type: Number,
            required: true,
        },
        takeProfit: {
            type: [Number],
            required: true,
        },
        leverage: {
            type: Number,
            required: true,
            min: 1,
        },
        messageId: {
            type: Number,
            required: true,
            unique: true,
        },
        orderId: {
            type: Number,
        },
        positionId: {
            type: Number,
        },
        state: {
            type: String,
            enum: ["pending", "order placed", "filled", "cancelled", "finished"],
            default: "pending",
        },
        realized_pnl: {
            type: Number,
            default: 0
        },
        sl_tp_done: {
            type: Boolean,
            default: false
        },
        error: {
            type: {
                message: { type: String },
                code: { type: Number }
            }
        },
        logs: {
            type: [{
                timestamp: { type: Number, default: () => Date.now() },
                message: { type: String, required: true }
            }],
            default: []
        },
        coinex_position: {
            type: Schema.Types.Mixed,
        }
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt
    }
);

export const Signals = model<Signal>("Signal", SignalSchema);

export const logSignal = async (signal: Signal, message: string) => {
    signal.logs.push({ timestamp: Date.now(), message });

    await signal.save()
}
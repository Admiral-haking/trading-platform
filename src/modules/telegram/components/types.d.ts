import { Dialog } from "telegram/tl/custom/dialog";

export type QrCodeCallback = (qrcode: string, expires: number) => void;
export type PasswordFillPromise = () => Promise<string>

export type LoginErrorCallback = (error: Error) => void

export type ChannelSubscriber = (channels: Dialog[]) => void

export type IncomeListenCallback = (event: { id: string, message: string, messageId: number, }) => void
export type IncomeDeleteListenCallback = (event: { messageId: number }) => void
export type IncomeReplyListenCallback = (event: { messageId: number, message: string }) => void


export interface TelegramListenIncomesProps {
    newSignal: IncomeListenCallback
    deleteSignal: IncomeDeleteListenCallback
    updateSignal: IncomeListenCallback
    reply: IncomeReplyListenCallback
}
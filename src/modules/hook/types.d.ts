export type WebhookQueue = {
    type: "new" | "update" | "delete" | "exit",
    signal?: Signal
    messageId: number
}
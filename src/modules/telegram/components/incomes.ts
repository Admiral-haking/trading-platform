import { NewMessage } from "telegram/events";
import { telegram } from "../client";
import { TelegramListenIncomesProps } from "./types";
import { Signals } from "../../../models/Signal";


export function telegramListenIncomes({ newSignal, deleteSignal, updateSignal, reply }: TelegramListenIncomesProps) {
    telegram.addEventHandler(async (event) => {

        const id = (event._chatPeer as any)?.channelId?.toString();

        if (!event.isChannel) return;

        if (event.originalUpdate.className === "UpdateDeleteChannelMessages") {
            const deletedMessages = event.originalUpdate.messages;
            return deletedMessages.forEach(messageId => deleteSignal({ messageId }))
        }

        if (event.originalUpdate.className === "UpdateEditChannelMessage") {
            event.originalUpdate.message
            const update = {
                message: event.message.text,
                id,
                messageId: event.originalUpdate.message.id
            }

            updateSignal(update)
        }

        const message = event.message.text;

        const replyId = event.message.replyTo?.replyToMsgId
        if (replyId) {
            if (await Signals.findOne({ messageId: replyId })) {
                reply({ messageId: replyId, message });
            }

            return;
        }

        if (!message || message.length < 50) return;


        newSignal({ message, id, messageId: event.message.id })

    }, new NewMessage({ incoming: true }));
}
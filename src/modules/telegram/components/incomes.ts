import { telegram } from "../client";
import { TelegramListenIncomesProps } from "./types";
import { Signals } from "../../../models/Signal";
import { wait } from "../../../utils/async";


export function telegramListenIncomes({ newSignal, deleteSignal, updateSignal, reply }: TelegramListenIncomesProps) {
    telegram.addEventHandler(async (event: any) => {

        const id = event.message?.peerId?.channelId?.toString();

        if (event.className === "UpdateDeleteChannelMessages") {
            const deletedMessages = event.messages;
            await wait(20)
            return deletedMessages.forEach((messageId: any) => deleteSignal({ messageId }))
        }

        if (event.className === "UpdateEditChannelMessage") {
            event.message
            const update = {
                message: event.message.message,
                id,
                messageId: event.message.id
            }
            await wait(20)
            updateSignal(update)
        }

        if (event.className === 'UpdateNewChannelMessage') {


            const message = event.message.message;

            const replyId = event.message.replyTo?.replyToMsgId
            if (replyId) {
                if (await Signals.findOne({ messageId: replyId })) {
                    reply({ messageId: replyId, message });
                }

                return;
            }

            if (!message || message.length < 50) return;


            newSignal({ message, id, messageId: event.message.id })
        }

    });
}
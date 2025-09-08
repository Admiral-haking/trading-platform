import { Dialog } from "telegram/tl/custom/dialog";
import { DynamicConfigs } from "../../utils/config";
import { logger } from "../../utils/logger";
import { getChannels } from "./components/channels";
import { telegramLogin } from "./components/login";
import { telegramConnect } from "./components/start";
import { telegramListenIncomes } from "./components/incomes";
import { LLM } from "../LLM";
import { Trader } from "../trader";

const session = DynamicConfigs.get("telegram");

class TelegramService {
    password: string = '';
    QRcode: string = '';

    needsPassword: boolean = false;

    channels: Dialog[] = [];

    private isListening = false;

    updateChannels = getChannels(channels => this.channels = channels);


    constructor() {
        if (!session) return;

        telegramConnect().then(() => {
            this.updateChannels();
            this.listenIncome();
        });
    }



    login() {
        telegramLogin({
            onError: error => logger.error(error),
            password: () => new Promise((resolve, reject) => {
                this.needsPassword = true;
                const interval = setInterval(() => {
                    if (!this.password) return;
                    resolve(this.password);
                    clearInterval(interval);
                    clearTimeout(timeout);
                    this.password = ""
                    this.QRcode = ""
                }, 1e3);

                const timeout = setTimeout(() => {
                    reject();
                    clearInterval(interval);
                }, 1e3 * 60);
            }),
            onQrCode: url => this.QRcode = url
        })
            .then(() => this.listenIncome())
    }


    private listenIncome() {
        if (this.isListening) return;
        telegramListenIncomes({
            newSignal: ({ id, message, messageId }) => {
                const safeList = this.getChannels();

                const exists = safeList.includes(id);

                if (!exists) return;

                LLM
                    .messageToJson()
                    .setMessage(message)
                    .onJson(signal => {
                        const dialog = this.channels.find(x => x.id?.toString() === id);
                        Trader.incomeSignal({
                            ...signal,
                            messageId,
                            logs: [{
                                timestamp: Date.now(),
                                message: `Initial Signal Income From ${dialog?.title || "Unknown"}`
                            }]
                        })
                    })
            },
            updateSignal: ({ id, message, messageId }) => {
                const safeList = this.getChannels();

                const exists = safeList.includes(id);

                if (!exists) return;

                LLM
                    .messageToJson()
                    .setMessage(message)
                    .onJson(signal => {
                        const dialog = this.channels.find(x => x.id?.toString() === id);
                        Trader.incomeUpdateSignal(messageId, {
                            ...signal,
                            messageId,
                            logs: [{
                                timestamp: Date.now(),
                                message: `Update Signal Income From ${dialog?.title || "Unknown"}`
                            }]
                        })
                    })
            },
            deleteSignal: ({ messageId }) => {
                Trader.incomeDeleteSignal(messageId)
            },
            reply: ({ messageId, message }) => {
                LLM
                    .replyToJson()
                    .setMessage(message)
                    .onJson(({ order }) => {
                        if (order === "continue") return;
                        Trader.incomeExitSignal(messageId)
                    })
            }
        })
        this.isListening = true;
    }


    setChannels(...ids: string[]) {
        const content = DynamicConfigs.get("channels") || "[]";
        const list: string[] = JSON.parse(content);

        list.push(...ids);

        DynamicConfigs.set("channels", JSON.stringify(list));
    }


    getChannels() {
        const content = DynamicConfigs.get("channels") || "[]";
        const list: string[] = JSON.parse(content);
        return list
    }


}


export const Telegram = new TelegramService();
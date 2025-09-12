import { Method } from "axios";
import { Follower } from "../../models/followes";
import { sendToMultiple } from "./components/bulk";
import { WebhookQueue } from "./types";

class WebHook {
    private queue: WebhookQueue[] = [];

    private transmitting: boolean = false;

    transmit(signal: WebhookQueue) {
        this.queue.push(signal);
    }

    private async send() {
        if (this.transmitting) return;

        const signal = this.queue.shift();

        if (!signal) return;

        const list = await Follower.find({ expire: { $gt: Date.now() } });
        this.transmitting = true;

        const result = await sendToMultiple(
            signal.signal,
            list.map(x => {
                const base = x.baseUrl + (x.baseUrl[x.baseUrl.length - 1] === "/" ? "" : "/") + "api/income"
                if (signal.type === 'new') return { method: "POST", url: base };
                if (signal.type === 'update') return { method: "PUT", url: base };
                if (signal.type === 'delete') return { method: "DELETE", url: base.concat("/", signal.messageId.toString()) };
                if (signal.type === 'exit') return { method: "DELETE", url: base.concat("/exit/", signal.messageId.toString()) };
                return { method: "GET", url: "/" }
            }) as { method: Method, url: string }[],
            {
                concurrency: 10,
                ratePerSecond: 20,
                retries: 3,
                timeoutMs: 8000,
            }
        );


        this.transmitting = false;
    }

    constructor() {
        setInterval(() => {
            this.send()
        }, 1e3);
    }
}

export const Webhook = new WebHook();
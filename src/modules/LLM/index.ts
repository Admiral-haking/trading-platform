import { DynamicConfigs } from "../../utils/config";
import { LLMMessageToJSON } from "./components/ask";
import { LLMReplyMessageToJSON } from "./components/order";


class DeepSeek {
    private apiKey: string = DynamicConfigs.get("deepSeekApiKey");

    constructor() { }

    setKey(key: string) {
        DynamicConfigs.set("deepSeekApiKey", key);
        this.apiKey = key;
    }

    messageToJson() {
        const handler = LLMMessageToJSON(this.apiKey);
        return handler;
    }

    replyToJson() {
        const handler = LLMReplyMessageToJSON(this.apiKey);
        return handler
    }
}


export const LLM = new DeepSeek();
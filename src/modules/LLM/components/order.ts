import axios from "axios";
import { LLMOrderReturnType } from "./types";
import { OrderPrompt } from "../constants/extract-order";

export function LLMReplyMessageToJSON(apiKey: string) {
    let onJson: (res: LLMOrderReturnType) => void;
    let onFail: (reason: any) => void;
    let _message = ''

    const returnObject = {
        setMessage: (message: string) => {
            _message = message
            return returnObject;
        },
        onJson: (callback: (res: LLMOrderReturnType) => void) => {
            onJson = callback;
            return returnObject
        },
        onFail: (callback: (reason: any) => void) => {
            onFail = callback;
            return returnObject;
        },
        think: () => {
            if (!_message) return;
            handle(_message, apiKey)
                .then(res => {
                    onJson?.(res)
                })
                .catch(err => {
                    console.log(err);
                    onFail?.(err)
                })
        }
    }

    return returnObject;
}


async function handle(message: string, apiKey: string): Promise<LLMOrderReturnType> {
    const DEEPSEEK_API_KEY = apiKey; // Replace with your actual API key
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Verify correct endpoint

    if (!apiKey) return { order: "continue" };

    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: OrderPrompt
                    },
                    { role: "user", content: message }
                ],
                temperature: 0, // For deterministic output
                max_tokens: 100,
                response_format: {
                    type: 'json_object'
                }
            },
            {
                headers: {
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                timeout: 6e4
            }
        );

        const modelResponse: string = response.data.choices[0].message.content.trim();

        console.log(modelResponse);

        return JSON.parse(modelResponse);

    } catch (error: any) {
        console.log(error);

        return { order: "continue" }
    }
}
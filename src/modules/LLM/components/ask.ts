import axios from "axios";
import { ExtractPrompt } from "../constants/extract-prompt";
import { LLMReturnType } from "./types";
import { validateLLMOutput } from "../utils/zod";

export function LLMMessageToJSON(apiKey: string) {
    let onJson: (res: LLMReturnType) => void;
    let onFail: (reason: any) => void;
    let _message = ''

    const returnObject = {
        setMessage: (message: string) => {
            _message = message
            return returnObject;
        },
        onJson: (callback: (res: LLMReturnType) => void) => {
            onJson = callback;
            return returnObject
        },
        onFail: (callback: (reason: any) => void) => {
            onFail = callback;
            return returnObject;
        },
        think: () => {
            if (!_message || _message.length <= 70) return;
            handle(_message, apiKey)
                .then(res => {
                    if ("status" in res) return onFail?.(res);

                    const result = validateLLMOutput(res);

                    if (result.status !== 'ok') return onFail?.(res);

                    onJson?.(result.data)
                })
        }
    }

    return returnObject;
}


async function handle(message: string, apiKey: string): Promise<LLMReturnType | { status: 'error' | 'warn' }> {
    const DEEPSEEK_API_KEY = apiKey; // Replace with your actual API key
    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions'; // Verify correct endpoint

    if (!apiKey) return { status: "error" };

    try {
        const response = await axios.post(
            DEEPSEEK_API_URL,
            {
                model: "deepseek-chat",
                messages: [
                    {
                        role: "system",
                        content: ExtractPrompt
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
        return JSON.parse(modelResponse);

    } catch (error: any) {
        return { status: "error" }
    }
}
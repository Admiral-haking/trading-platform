import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from "axios";
import { CoinexHTTPResponse } from "../types/response";
import { jsonToQueryString } from "./param";
import { DynamicConfigs } from "../../../utils/config";
import { createHmacSha256Signature } from "./sign";

const baseURL = 'https://api.coinex.com/v2'
const coinexAxios = axios.create({
    baseURL,
})

coinexAxios.interceptors.response.use(
    response => {
        if (response.data.code && response.data.code > 0) {
            return Promise.reject(response.data)
        }
        return response.data
    }
)

const MAX_REQUESTS_PER_INTERVAL = 5;
const INTERVAL_MS = 1000;


// In-memory state
export const queue: { resolve: () => void, data: { body: Record<string, string | number>, url: string, params: Record<string, string> } }[] = [];
let currentRequests = 0;

// Process queue every interval
setInterval(() => {
    currentRequests = 0; // reset counter
    while (queue.length > 0 && currentRequests < MAX_REQUESTS_PER_INTERVAL) {
        const { resolve } = queue.shift()!;
        currentRequests++;
        resolve();
    }
}, INTERVAL_MS);

coinexAxios.interceptors.request.use(
    config => {

        const accessId = DynamicConfigs.get("CoinexAccessId")
        const secretKey = DynamicConfigs.get("CoinexSecretKey")

        if (!accessId || !secretKey) return new Promise<InternalAxiosRequestConfig>((resolve) => {
            if (currentRequests < MAX_REQUESTS_PER_INTERVAL) {
                currentRequests++;
                resolve(config);
            } else {
                queue.push({
                    resolve: () => resolve(config), data: {
                        body: config.data,
                        url: (config.baseURL || "") + config.url,
                        params: config.params
                    }
                });
            }
        })

        const url = "/v2" + config.url?.replace(baseURL, "") || "";

        const params = jsonToQueryString(config.params || {});

        const hasUrlParams = url.includes("?");

        const lastIndexIsQuestionMark = url.endsWith("?")

        const hasAndMark = url.endsWith("&");

        const prefix = hasUrlParams ?
            lastIndexIsQuestionMark ? "" :
                (hasAndMark ? "" : "&")
            :
            Object.keys(params).length ? "?" : ""

        const path = url + prefix + params;

        const hasBody = Boolean(config.data);
        const body = JSON.stringify(config.data || {});

        const timestamp = Date.now();

        const prepared_str =
            (config.method || "get").toUpperCase() +
            path +
            (hasBody ? body : "") +
            timestamp


        const signed_str = createHmacSha256Signature(prepared_str, secretKey);

        config.headers.set("X-COINEX-KEY", accessId);
        config.headers.set("X-COINEX-SIGN", signed_str);
        config.headers.set("X-COINEX-TIMESTAMP", timestamp)

        return new Promise<InternalAxiosRequestConfig>((resolve) => {
            if (currentRequests < MAX_REQUESTS_PER_INTERVAL) {
                currentRequests++;
                resolve(config);
            } else {
                queue.push({
                    resolve: () => resolve(config), data: {
                        body: config.data,
                        url: (config.baseURL || "") + config.url,
                        params: config.params
                    }
                });
            }
        });
    },
    error => {
        return Promise.reject(error);
    },
    { synchronous: false }
)

export const Get = <A, B = any>(url: string, config?: AxiosRequestConfig<B>) => coinexAxios.get<any, CoinexHTTPResponse<A>>(url, config)
export const Delete = <A, B = any>(url: string, config?: AxiosRequestConfig<B>) => coinexAxios.delete<any, CoinexHTTPResponse<A>>(url, config)
export const Post = <A, B = any>(url: string, data: B, config?: AxiosRequestConfig<B>) => coinexAxios.post<any, CoinexHTTPResponse<A>>(url, data, config)

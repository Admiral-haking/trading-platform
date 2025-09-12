import axios, { Method, AxiosRequestConfig, AxiosError } from "axios";

/** Small helpers */
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

class Semaphore {
    private max: number;
    private used = 0;
    private queue: Array<() => void> = [];
    constructor(max: number) { this.max = Math.max(1, max); }
    async acquire(): Promise<void> {
        if (this.used < this.max) { this.used++; return; }
        await new Promise<void>((resolve) => this.queue.push(() => { this.used++; resolve(); }));
    }
    release(): void {
        this.used = Math.max(0, this.used - 1);
        const next = this.queue.shift();
        if (next) next();
    }
}

/** Token-bucket-ish limiter (rate per second). */
class RateLimiter {
    private capacity: number;
    private tokens: number;
    private lastRefill = Date.now();

    constructor(ratePerSecond: number) {
        this.capacity = Math.max(1, ratePerSecond);
        this.tokens = this.capacity;
    }

    private refill() {
        const now = Date.now();
        const elapsed = now - this.lastRefill;
        if (elapsed >= 1000) {
            const slots = Math.floor(elapsed / 1000);
            this.tokens = Math.min(this.capacity, this.tokens + slots * this.capacity);
            this.lastRefill += slots * 1000;
        }
    }

    async take(): Promise<void> {
        // spin-wait lightly until a token is available
        // (keeps code tiny; swap to a queue if you need super high scale)
        for (; ;) {
            this.refill();
            if (this.tokens > 0) {
                this.tokens--;
                return;
            }
            await sleep(10);
        }
    }
}

export type BatchResult =
    | { url: string; status: "fulfilled"; data: any; statusCode: number }
    | { url: string; status: "rejected"; error: string; statusCode?: number };

export interface BatchOptions {
    /** Max in-flight requests at once (default 10). */
    concurrency?: number;
    /** Soft cap on requests per second across the whole batch (optional). */
    ratePerSecond?: number;
    /** Axios timeout per request in ms (default 10_000). */
    timeoutMs?: number;
    /** Retries per URL on failure (default 1). */
    retries?: number;
    /** Base backoff in ms (default 250). Exponential with jitter. */
    backoffBaseMs?: number;
    /** Extra axios config to merge into each request (headers, auth, etc). */
    axios?: AxiosRequestConfig;
}

/**
 * Fire the same request to many URLs with concurrency control, optional rate limit,
 * and resilient result collection.
 */
export async function sendToMultiple(
    body: unknown,
    endpoints: { method: Method, url: string }[],
    opts: BatchOptions = {}
): Promise<BatchResult[]> {
    const {
        concurrency = 10,
        ratePerSecond,
        timeoutMs = 10_000,
        retries = 1,
        backoffBaseMs = 250,
        axios: extraAxios = {},
    } = opts;

    const sem = new Semaphore(concurrency);
    const limiter = ratePerSecond ? new RateLimiter(ratePerSecond) : undefined;

    const tasks = endpoints.map(({ url, method }) => (async (): Promise<BatchResult> => {
        await sem.acquire();
        try {
            if (limiter) await limiter.take();

            const attempt = async () => {
                try {
                    const res = await axios({
                        method,
                        url,
                        data: body,
                        timeout: timeoutMs,
                        ...extraAxios,
                    });
                    return {
                        url,
                        status: "fulfilled" as const,
                        data: res.data,
                        statusCode: res.status,
                    };
                } catch (e) {
                    const err = e as AxiosError;
                    const code = err.response?.status;
                    const msg = err.message || "Request failed";
                    throw Object.assign(new Error(msg), { statusCode: code });
                }
            };

            let lastError: any;
            for (let i = 0; i <= retries; i++) {
                try {
                    return await attempt();
                } catch (err) {
                    lastError = err;
                    if (i === retries) break;
                    const jitter = Math.floor(Math.random() * 100);
                    const backoff = backoffBaseMs * Math.pow(2, i) + jitter;
                    await sleep(backoff);
                }
            }

            return {
                url,
                status: "rejected",
                error: String(lastError?.message ?? lastError ?? "Unknown error"),
                statusCode: lastError?.statusCode,
            };
        } finally {
            sem.release();
        }
    })());

    // Run all tasks concurrently; settle everything
    return Promise.all(tasks);
}

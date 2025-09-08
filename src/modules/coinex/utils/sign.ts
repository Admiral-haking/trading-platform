import * as crypto from "crypto";

export function createHmacSha256Signature(payload: string, secret: string): string {

    return crypto
        .createHmac("sha256", secret)
        .update(payload, "utf8")
        .digest("hex")
        .toLowerCase();
}
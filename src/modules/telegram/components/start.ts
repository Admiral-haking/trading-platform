import { telegram } from "../client";

export async function telegramConnect() {
    await telegram.connect()

    return true;
}
import { DynamicConfigs } from "../../../utils/config";
import { telegram } from "../client";
import { telegramKeys } from "../constants/app";
import { LoginErrorCallback, PasswordFillPromise, QrCodeCallback } from "./types";

type LoginProps = {
    onQrCode: QrCodeCallback
    password: PasswordFillPromise
    onError: LoginErrorCallback
}
export async function telegramLogin({ onError, onQrCode, password }: LoginProps) {

    await telegram.connect();


    await telegram.signInUserWithQrCode(
        telegramKeys,
        {
            qrCode: async ({ token, expires }) => {
                const url = `tg://login?token=${token.toString("base64url")}`;
                onQrCode(url, expires)
            },
            password,
            onError,
        }
    );

    DynamicConfigs.set("telegram", telegram.session.save() + "")
}
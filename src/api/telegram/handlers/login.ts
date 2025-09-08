import { Telegram } from "../../../modules/telegram"
import { telegram } from "../../../modules/telegram/client";
import { wait } from "../../../utils/async";


export const telegramLoginHandler: Handler = async (req, res, next) => {
    try {
        await wait(1);

        res.json({
            isConnect: telegram.connected,
            isAuth: await telegram.checkAuthorization(),
            needPassword: Telegram.needsPassword,
        })
    }
    catch (err) {
        next(err)
    }
}
export const telegramQrCodeCreate: Handler = async (req, res, next) => {
    try {
        Telegram.login();

        res.status(201).send();
    }
    catch (err) {
        next(err)
    }
}
export const telegramQrCodeGet: Handler = async (req, res, next) => {
    try {
        res.json({ url: Telegram.QRcode })
    }
    catch (err) {
        next(err)
    }
}
export const telegramSetPassword: Handler = async (req, res, next) => {
    try {
        Telegram.password = req.body.password
        res.status(201).send();
    }
    catch (err) {
        next(err)
    }
}
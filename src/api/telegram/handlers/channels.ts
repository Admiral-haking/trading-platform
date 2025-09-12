import { Telegram } from "../../../modules/telegram"

export const telegramListHandler: Handler = async (req, res, next) => {
    try {
        await Telegram.updateChannels();
        res.json(Telegram.channels.map(x => ({
            title: x.title,
            id: x.entity?.id,
            selected: Telegram.getChannels().some(c => c === x.entity?.id?.toString())
        })))
    }
    catch (err) {
        next(err)
    }
}
export const telegramSaveHandler: Handler = async (req, res, next) => {
    try {
        Telegram.setChannels(...req.body as string[]) //list of selected ids
        res.status(201).send()
    }
    catch (err) {
        next(err)
    }
}
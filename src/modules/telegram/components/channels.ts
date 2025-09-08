import { telegram } from "../client";
import { ChannelSubscriber } from "./types";

export function getChannels(subscriber: ChannelSubscriber) {
    return async () => {
        const isAuth = await telegram.checkAuthorization();

        if (!isAuth) return [];

        const dialogs = await telegram.getDialogs();

        const channels = dialogs.filter(x => x.isChannel && !x.isGroup);

        subscriber(channels);

        return channels;
    }
}
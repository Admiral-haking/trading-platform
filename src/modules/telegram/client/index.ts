import { TelegramClient } from "telegram"
import { StringSession } from "telegram/sessions";
import { telegramKeys } from "../constants/app";
import { DynamicConfigs } from "../../../utils/config";


const stringSession = new StringSession(DynamicConfigs.get("telegram"));

export const telegram = new TelegramClient(stringSession, telegramKeys.apiId, telegramKeys.apiHash, { connectionRetries: 5 });

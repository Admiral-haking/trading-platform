export type TelegramCheck = {
  isAuth?: boolean;
  needPassword?: boolean;
};

export type TelegramQr = {
  url: string; // empty string when not ready
};


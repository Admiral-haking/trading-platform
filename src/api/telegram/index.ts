import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { telegramLoginHandler, telegramQrCodeCreate, telegramQrCodeGet, telegramSetPassword } from "./handlers/login";
import { telegramListHandler, telegramSaveHandler } from "./handlers/channels";

export const telegramRouter = Router();

telegramRouter.get("/telegram/check", authMiddleware, telegramLoginHandler)
telegramRouter.post("/telegram/create-qr-code", authMiddleware, telegramQrCodeCreate)
telegramRouter.get("/telegram/get-qr-code", authMiddleware, telegramQrCodeGet)
telegramRouter.post("/telegram/set-password", authMiddleware, telegramSetPassword)
telegramRouter.get("/telegram/list", authMiddleware, telegramListHandler)
telegramRouter.post("/telegram/save", authMiddleware, telegramSaveHandler)

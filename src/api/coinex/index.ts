import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { coinexFullDataHandler } from "./handler/full";
import { coinexClosePositionHandler } from "./handler/close";

export const coinexRouter = Router();

coinexRouter.get("/coinex/full", authMiddleware, coinexFullDataHandler);
coinexRouter.delete("/coinex/close/:id", authMiddleware, coinexClosePositionHandler)
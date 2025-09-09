import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { coinexFullDataHandler } from "./handler/full";
import { coinexClosePositionHandler } from "./handler/close";
import { depositAddressesHandler, depositHistoryHandler } from "./handler/deposit";
import { internalTransferHandler, withdrawalHistoryHandler } from "./handler/withdrawal";
import { coinexOutgoingRequests } from "./handler/requests";

export const coinexRouter = Router();

coinexRouter.get("/coinex/full", authMiddleware, coinexFullDataHandler);
coinexRouter.delete("/coinex/close/:id", authMiddleware, coinexClosePositionHandler)
coinexRouter.get("/coinex/deposit/address/:ccy", authMiddleware, depositAddressesHandler);
coinexRouter.get("/coinex/deposit/history", authMiddleware, depositHistoryHandler);
coinexRouter.post("/coinex/transfer", authMiddleware, internalTransferHandler);
coinexRouter.get("/coinex/withdrawal/history", authMiddleware, withdrawalHistoryHandler)

coinexRouter.get("/coinex/monitor", authMiddleware, coinexOutgoingRequests)
import { Router } from "express";
import { initStatusHandler, initUpdateHandler } from "./handlers/init";
import { loginHandler } from "./handlers/login";
import { authMiddleware } from "../../middleware/auth";
import { loginUpdateHandler } from "./handlers/update";

export const authRouter = Router();

authRouter.get("/auth/init", initStatusHandler);
authRouter.post("/auth/login", loginHandler);
authRouter.put("/auth/init", authMiddleware, initUpdateHandler);
authRouter.put("/auth/login", authMiddleware, loginUpdateHandler)
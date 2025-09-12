import { Router } from "express";
import { incomeValidationMiddleware } from "./common/zod";
import { incomeNewSignal } from "./handlers/new-signal";
import { incomeUpdateSignal } from "./handlers/update-signal";
import { incomeDeleteSignal } from "./handlers/delete-signal";
import { incomeExitSignal } from "./handlers/exit-signal";

export const incomeRouter = Router();

incomeRouter.post("/income", incomeValidationMiddleware, incomeNewSignal)
incomeRouter.put("/income", incomeValidationMiddleware, incomeUpdateSignal)
incomeRouter.delete("/income/exist/:messageId", incomeExitSignal)
incomeRouter.delete("/income/:messageId", incomeDeleteSignal)
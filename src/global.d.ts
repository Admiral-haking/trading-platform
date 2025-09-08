import { NextFunction, Request, Response } from "express";

declare global {
    type Handler = (req: Request, res: Response, next: NextFunction) => any
}
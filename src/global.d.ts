import { NextFunction, Request, Response } from 'express';
import type { HydratedDocument } from 'mongoose';
import type { IUser } from './models/User';

declare global {
    namespace Express {
        interface Request {
            user?: HydratedDocument<IUser>;
        }
    }
    type Handler = (req: Request, res: Response, next: NextFunction) => any
}

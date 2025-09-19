import jwt from "jsonwebtoken";
import { privateKey } from "../utils/private";
import { Users } from "../models/User";


export const authMiddleware: Handler = async (req, res, next) => {
    try {
        const token = (req.headers.authorization || req.headers.token || "");

        if (!token || typeof token !== 'string') return res.status(401).send();

        const [username, password] = jwt.verify(token.replace("Bearer ", ""), privateKey).split("-")

        const user = await Users.findOne({ username, password });

        if (!user) return res.status(403).send();

        req.user = user;
        next();
    }
    catch (err) {
        next(err)
    }
}

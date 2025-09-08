import { Users } from "../../../models/User"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { privateKey } from "../../../utils/private";


export const loginUpdateHandler: Handler = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).send()


        const token_header = req.headers.authorization || req.headers.token;

        if (!token_header || typeof token_header !== 'string') return res.status(401).send();

        const user = jwt.verify(token_header, privateKey).split("-")

        await Users.updateOne({ username: user[0], password: user[1] }, { $set: { username, password: crypto.createHash("sha256").update(password).digest("hex") } });

        const token = jwt.sign(`${username}-${crypto.createHash("sha256").update(password).digest("hex")}`, privateKey, { algorithm: "RS256" });

        res.json({ token })
    }
    catch (err) {
        next(err)
    }
}
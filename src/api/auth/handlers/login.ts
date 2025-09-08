import { RateLimit } from "../../../models/RateLimit";
import { Users } from "../../../models/User"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { privateKey } from "../../../utils/private";


export const loginHandler: Handler = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) return res.status(400).send()

        await RateLimit.create({ username });

        const hasUser = !!(await Users.findOne({}))

        if (!hasUser) {
            await Users.create({ username, password: crypto.createHash("sha256").update(password).digest("hex") })
        }

        const attempts = await RateLimit.countDocuments({ username, createdAt: { $gt: new Date(Date.now() - (1e3 * 60 * 60 * 24)) } });

        const reachedLimit = attempts > 5;

        if (reachedLimit) return res.status(429).send()

        const user = await Users.findOne({ username, password: crypto.createHash("sha256").update(password).digest("hex") });

        if (!user) return res.status(401).send();

        const token = jwt.sign(`${username}-${user.password}`, privateKey, { algorithm: "RS256" });

        res.json({ token })
    }
    catch (err) {
        next(err)
    }
}
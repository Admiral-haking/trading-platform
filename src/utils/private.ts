
import { generateKeyPairSync } from "crypto";
import fs from "fs";

export const privateKey = fs.existsSync("./private.key") ?
    fs.readFileSync("./private.key", { encoding: "utf-8" }) : generateKeyPairSync('rsa', {
        modulusLength: 2048, // secure size
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    }).privateKey;


if (!fs.existsSync("./private.key")) fs.writeFileSync("./private.key", privateKey, { encoding: 'utf-8' })
import fs from "fs";
import os from "os";
import path from "path";

const homedir = os.homedir();

const configFile = path.join(homedir, "trading.conf.json");

if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, "{}");

class AppDynamicConfigs {
    configs: Record<string, string> = {};

    constructor() {
        const content = fs.readFileSync(configFile, { encoding: "utf-8" });
        try {
            this.configs = JSON.parse(content);
        }
        catch { }
    }

    set(key: string, value: string) {
        this.configs[key] = value;
        fs.writeFileSync(configFile, JSON.stringify(this.configs));
    }


    get(key: string) {
        return this.configs[key] || ""
    }
}

export const DynamicConfigs = new AppDynamicConfigs()
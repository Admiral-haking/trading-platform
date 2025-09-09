import { logger } from "../../../utils/logger";
import { Coinex } from "../../coinex";
import { ChainInfo, DepositRecord } from "../../coinex/types/deposit";
import { TraderBalance } from "./balance";

export class TraderDeposit extends TraderBalance {

    deposits: DepositRecord[] = [];

    depositUSDTAddressTRC20: string = ''

    constructor() {
        super();
    }

    async getDepositAddress(ccy: string): Promise<ChainInfo[]>;
    async getDepositAddress(ccy: string, chain: string): Promise<string>;
    async getDepositAddress(ccy: string, chain?: string) {
        try {
            if (!chain) {
                const { data: info } = await Coinex.get_coin_info({ ccy });
                return info.find(x => x.short_name === "USDT")?.chain_info || []
            }
            const { data: { address } } = await Coinex.get_deposit_address({ ccy, chain });

            if (ccy === 'USDT' && chain === "TRC20") {
                this.depositUSDTAddressTRC20 = address;
            }

            return address
        }
        catch (err) {
            logger.error(err);
            if (!chain) return [];
            return "";
        }
    }

    async getDepositHistory() {
        try {
            const { data: list } = await Coinex.get_deposit_history({ limit: 100 });
            return list;
        }
        catch (err) {
            logger.error(err)
            return []
        }
    }
}
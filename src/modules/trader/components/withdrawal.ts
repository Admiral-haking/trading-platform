import { wait } from "../../../utils/async";
import { DynamicConfigs } from "../../../utils/config";
import { Coinex } from "../../coinex";
import { TransferRequest } from "../../coinex/types/transfer";
import { WithdrawalRequest } from "../../coinex/types/withdraw";
import { TraderDeposit } from "./deposit";

export class TraderWithdrawal extends TraderDeposit {

    withdrawalDayOfWeek: number = Number(DynamicConfigs.get("withdrawalDayOfWeek") || "4");
    withdrawalBase: number = Number(DynamicConfigs.get("withdrawalBase") || "500");
    withdrawalTakeProfitPercentage: number = Number(DynamicConfigs.get("withdrawalTakeProfitPercentage") || "50");
    walletAddress: string = DynamicConfigs.get("wallet")


    constructor() {
        super();
        setInterval(() => {
            this.transferToMyWallet()
        }, 1e3 * 60 * 60 * 24);
    }

    async withdrawal(params: WithdrawalRequest) {
        const { data } = await Coinex.withdrawal(params);
        return data;
    }

    async getWithdrawals() {
        const { data } = await Coinex.get_withdrawal_history({});
        return data
    }

    async transfer(params: TransferRequest) {
        const { data } = await Coinex.transfer(params);

        return data as "OK"
    }

    async transferToMyWallet() {
        await this.updateBalances()
        if (this.featuresUSDTBalance < this.withdrawalBase || !this.walletAddress) return;

        const profit = this.featuresUSDTBalance - this.withdrawalBase;

        const profitUnit = profit / 100;
        const myShareFromProfit = profitUnit * this.withdrawalTakeProfitPercentage;


        const transferableUSDT = Math.ceil(myShareFromProfit);

        if (transferableUSDT < 13) return;

        await this.transfer({
            ccy: "USDT",
            amount: transferableUSDT.toString(),
            from_account_type: "FUTURES",
            to_account_type: "SPOT"
        });

        await wait(60 * 10);

        await this.withdrawal({
            amount: (transferableUSDT - 2).toString(),
            ccy: "USDT",
            to_address: this.walletAddress,
            chain: "TRC20",
            withdraw_method: "on_chain"
        })
    }
}
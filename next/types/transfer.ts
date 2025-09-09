export type TransferAccountType = 'SPOT' | 'FUTURES';

export type TransferRequest = {
  from_account_type: TransferAccountType;
  to_account_type: TransferAccountType;
  ccy: string; // Currency name
  amount: string; // amount as string
};

export type TransferResponse = unknown; // backend returns Trader.transfer result


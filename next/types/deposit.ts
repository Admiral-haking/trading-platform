export type DepositRecord = {
  deposit_id: number;
  created_at: number;
  tx_id: string;
  ccy: string;
  chain: string;
  deposit_method: string;
  amount: string;
  actual_amount: string;
  to_address: string;
  confirmations: number;
  status: string;
  tx_explorer_url: string;
  to_addr_explorer_url: string;
  remark: string;
};

export type ChainAddresses = Record<string, string>; // chain -> address


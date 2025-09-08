export interface DepositAddress {
    address: string,
    memo: string
}

export interface DepositAddressParams {
    ccy: string
    chain: string
}

export interface CoinInfoParams {
    ccy: string
}

export interface TokenInfo {
    short_name: string;
    full_name: string;
    website_url: string;
    white_paper_url: string;
    chain_info: ChainInfo[];
}

interface ChainInfo {
    chain_name: string;
    identity: string;
    explorer_url: string;
}

export interface DepositQueryParams {
    ccy?: string;     // Currency name
    tx_id?: string;   // TxID
    status?: string;  // Deposit status
    page?: number;    // Number of pagination (default: 1)
    limit?: number;   // Number in each page (default: 10)
}
export interface DepositRecord {
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
}

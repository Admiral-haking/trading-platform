export interface WithdrawalRequest {
    ccy: string;             // Currency name (required)
    chain?: string;          // Chain name (required for On-chain)
    to_address: string;      // Withdrawal address (required)
    withdraw_method?: "on_chain" | "inter_user"; // Default is "on_chain"
    memo?: string;           // Required for certain currencies
    amount: string;          // Withdrawal amount (required)
    fee_ccy?: string;        // Trading fee currency
    extra?: Record<string, any>; // Extra info (e.g., { chain_id: string } for KDA)
    remark?: string;         // Withdrawal note
}


export interface WithdrawalRecord {
    withdraw_id: number;
    created_at: number;
    ccy: string;
    chain: string;
    amount: string;
    fee_ccy: string;
    actual_amount: string;
    withdraw_method: "on_chain" | "inter_user";
    memo: string;
    tx_fee: string;
    tx_id: string;
    to_address: string;
    confirmations: number;
    explorer_address_url: string;
    explorer_tx_url: string;
    status: string;
    remark: string;
}

export interface WithdrawalQueryParams {
    ccy?: string;         // Currency name
    withdraw_id?: number; // Withdrawal record ID
    status?: string;      // Withdrawal status
    page?: number;        // Page number (default: 1)
    limit?: number;       // Number per page (default: 10)
}

export interface WithdrawalQueryRecord {
    withdraw_id: number;
    created_at: number;
    ccy: string;
    chain: string;
    amount: string;
    actual_amount: string;
    withdraw_method: "on_chain" | "inter_user";
    memo: string;
    tx_fee: string;
    tx_id: string;
    to_address: string;
    confirmations: number;
    explorer_address_url: string;
    explorer_tx_url: string;
    status: string;
    remark: string;
}

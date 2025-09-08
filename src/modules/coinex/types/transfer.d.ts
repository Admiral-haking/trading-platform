export interface TransferRequest {
    from_account_type: "SPOT" | "MARGIN" | "FUTURES"; // could be narrowed if you know all account types
    to_account_type: "SPOT" | "MARGIN" | "FUTURES";
    ccy: string;     // Currency name
    amount: string;  // Transfer amount
}
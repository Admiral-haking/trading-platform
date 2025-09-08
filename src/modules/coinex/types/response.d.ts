export interface CoinexHTTPResponse<T> {
    code: number
    data: T
    message: string
    pagination?: {
        total: number,
        has_next: boolean
    }
}

export interface CoinexHTTPError {
    code: number
    message: string
}
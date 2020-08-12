export interface User {
    isConnected: boolean;
    network: string;
    positions: Position[];
}

export interface Option {
    contract: string;
    expiry: string;
    strikePrice: string;
    spotPrice: number;
    liquidity: string;
}

export interface Position {
    contract: string;
    expiry: string;
    premium: string;
}

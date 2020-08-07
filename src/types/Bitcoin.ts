export type UTXO = {
    txid: string;
    value: number;
    vout: number;
}

export interface BitcoinInterface {
    getBlockHeight(): Promise<number>;
    getBlockHeader(height: number): Promise<Buffer>;
    getStatusTransaction(txid: string): Promise<{
        confirmed: boolean
        confirmations: number
    }>;
    getHexTransaction(txid: string): Promise<string>;
    getRawTransaction(txid: string): Promise<Buffer>;
    getMerkleProof(txid: string): Promise<{
        block_height: number,
        merkle: string[]
        pos: number
    }>;
}
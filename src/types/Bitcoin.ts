export type UTXO = {
    txid: string;
    value: number;
    vout: number;
}

export interface BitcoinInterface {
    getBlockHeight(): Promise<number>;
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
    getAccountValue(addr: string): Promise<number>;
    getAccountUtxos(addr: string): Promise<UTXO[]>;
}
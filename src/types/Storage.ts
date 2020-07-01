export type Option = {
    amountBtc: string
    // btc address of the recipient/seller
    btcAddress: string
    // eth address of the recipient/seller
    ethAddress: string
    // the ticker id of the option contract
    optionId: string
    // current number of confirmations
    confirmations: number
    // has this option been exercised
    pending: boolean
}
  
export interface StorageInterface {
    loadPendingOptions(): Record<string, Record<string, Option>>;
    getPendingOptions(): string[];
    getPendingTransactionsFor(option: string): Array<Option & { txid: string }>;
    setPendingOption(option: string, txId: string, amountBtc: string, btcAddress: string, ethAddress: string, optionId: string, confirmations: number): void;
    modifyPendingConfirmations(option: string, txid: string, value: number): void;
    removePendingOption(option: string, txId: string): void;
    hasPending(): boolean;
    hasPendingTransactionsFor(option: string): boolean;
}

export interface PersistentStorage {
    loadItem<T>(key: string, factory?: (json: any) => T): T | null;
    storeItem(key: string, item: any): void;
}

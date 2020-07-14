import { BitcoinInterface } from "../types/Bitcoin";
import * as esplora from '@interlay/esplora-btc-api';

export const STABLE_CONFIRMATIONS = 1;

export class BitcoinQuery implements BitcoinInterface {
  txApi: esplora.TxApi;
  addrApi: esplora.AddressApi;
  blockApi: esplora.BlockApi;

  constructor() {
    const basePath = "https://blockstream.info/testnet/api";
    this.txApi = new esplora.TxApi({basePath: basePath});
    this.addrApi = new esplora.AddressApi({basePath: basePath});
    this.blockApi = new esplora.BlockApi({basePath: basePath});
  }

  async getBlockHeight(): Promise<number> {
    let result = await this.blockApi.getLastBlockHeight();
    return result.data;
  }

  // Returns a status object with
  // status = {
  //   confirmed: bool,
  //   confirmations: number
  // }
  async getStatusTransaction(txid: string): Promise<{
    confirmed: boolean
    confirmations: number
  }> {

    let txStatus = {
      confirmed: false,
      confirmations: 0,
    }

    let status = (await this.txApi.getTxStatus(txid)).data;

    txStatus.confirmed = status.confirmed;

    let currentChainTip = await this.getBlockHeight();

    if (status.block_height) {
      txStatus.confirmations = currentChainTip - status.block_height;
    }

    return txStatus;
  }

  async getHexTransaction(txid: string) {
    return (await this.txApi.getTxHex(txid)).data;
  }

  // Compatible with BTC core getrawtransaction
  // https://developer.bitcoin.org/reference/rpc/getrawtransaction.html
  // returns a hex encoded rawtx
  async getRawTransaction(txid: string) {
    return Buffer.from(await this.getHexTransaction(txid), 'hex');
  }

  // Gets the Merkle proof including the position of the transaction
  // NOT compatible with bitcoin-core
  // Follows: https://electrumx.readthedocs.io/en/latest/protocol-methods.html#blockchain-transaction-get-merkle
  //
  // returns a proof object with a pos (index) of the transaction
  // proof = {
  //   block_height: number,
  //   merkle: [] hex,
  //   pos: number
  // }
  async getMerkleProof(txid: string): Promise<{
    block_height: number,
    merkle: string[]
    pos: number
  }> {
    const result = await this.txApi.getTxMerkleProof(txid);
    return result.data;
  }

  async getAccountValue(addr: string) {
    const info = (await this.addrApi.getAddress(addr)).data;
    return info.chain_stats.funded_txo_sum || 0;
  }

  async getAccountUtxos(addr: string) {
    const info = (await this.addrApi.getAddressUtxo(addr)).data;
    return info.map(utxo => {
      return {
        txid: utxo.txid,
        value: utxo.value,
        vout: utxo.vout,
      }
    })
  }
}
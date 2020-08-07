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

  async getBlockHeader(height: number): Promise<Buffer> {
    const hashResult = await this.blockApi.getBlockAtHeight(height);
    const hash = hashResult.data;
    const blockResult = await this.blockApi.getBlockRaw(hash, {responseType: 'arraybuffer'});
    return blockResult.data.slice(0, 80);
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
  async getRawTransaction(txid: string): Promise<Buffer> {
    return (await this.txApi.getTxRaw(txid, {responseType: 'arraybuffer'})).data;
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
}

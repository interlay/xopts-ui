// YOU MUST ENABLE HTTPS FOR THIS TO WORK
// HTTPS=true yarn start

import platform from 'platform';
import u2fTransport from '@ledgerhq/hw-transport-u2f';
import webUsbTransport from '@ledgerhq/hw-transport-webusb';
import AppBtc from "@ledgerhq/hw-app-btc";
import {toBufferLE} from 'bigint-buffer';
import { UTXO } from '../types/Bitcoin';

const OPEN_TIMEOUT = 10000;
const LISTENER_TIMEOUT = 300;

type KeySet = {purpose: number, coinType:  number, account: number, change: number}

function deriveKeySet(keys: KeySet) {
    return `${keys.purpose}'/${keys.coinType}'/${keys.account}'/${keys.change}`;
}

function derivePath(keys: KeySet, index: number) {
    return `${deriveKeySet(keys)}/${index}`;
}

const MAINNET: KeySet = {purpose: 49, coinType:  0, account: 0, change: 0};
const TESTNET: KeySet = {purpose: 49, coinType:  1, account: 0, change: 0};

export async function connect() {
    let transport = await getLedgerTransport();
    transport.setDebugMode(true);
    return new AppBtc(transport);
}

export async function getWalletAddress(app: AppBtc, index: number) {
    // TODO: allow user to change format
    const key = await app.getWalletPublicKey(derivePath(TESTNET, index), { format: "bech32" });
    return key.bitcoinAddress;
}

export async function createTransaction(app: AppBtc, amount: number, utxos: Array<UTXO & {hex: string}>, script: Buffer) {
    const txs = utxos.map(utxo => {
        return {
            tx: app.splitTransaction(utxo.hex, true),
            ...utxo
        };
    });

    const outputScript = app.serializeTransactionOutputs({
        version: Buffer.from("01000000", 'hex'),
        inputs: [],
        outputs: [{
            amount: toBufferLE(BigInt(amount), 8),
            script: script,
        }]
    }).toString('hex');

    return app.createPaymentTransactionNew(
        {
            inputs: txs.map(utxo => {
                return [utxo.tx, utxo.vout, null, null];
            }),
            associatedKeysets: [deriveKeySet(TESTNET)],
            outputScriptHex: outputScript,
            segwit: true,
            additionals: ["bitcoin", "bech32"],
        }
    );
}

const isWebUsbSupported = async () => {
    // https://github.com/MyEtherWallet/MyEtherWallet/blob/master/src/wallets/hardware/ledger/index.js#L145
    const isSupported = await webUsbTransport.isSupported();
    return isSupported && platform.os?.family !== 'Windows' && platform.name !== 'Opera';
};

const getLedgerTransport = async () => {
    const webUsb = await isWebUsbSupported();
    return u2fTransport.create(OPEN_TIMEOUT, LISTENER_TIMEOUT);
};
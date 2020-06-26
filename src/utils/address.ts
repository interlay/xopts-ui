import * as bitcoin from 'bitcoinjs-lib';
import { Script } from "@interlay/xopts";

const NETWORK = bitcoin.networks.testnet;

interface Payable {
    hash?: Buffer;
    address?: string;
}

function decode<P extends Payable, O>(p: P, f: (payment: P, options?: O) => P, t: Script): { hash: string, format: Script} | undefined {
    try {
        let pay = f(p)
        let hash = pay.hash ? "0x" + pay.hash.toString('hex') : '';        
        return { hash: hash, format: t};
    } catch (err) {
        return undefined;
    }
}

export function decodeAddress(addr: string) {
    return decode({address: addr, network: NETWORK}, bitcoin.payments.p2sh, Script.p2sh) ||
           decode({address: addr, network: NETWORK}, bitcoin.payments.p2pkh, Script.p2pkh) ||
           decode({address: addr, network: NETWORK}, bitcoin.payments.p2wpkh, Script.p2wpkh);
}

function encode<P extends Payable, O>(p: P, f: (payment: P, options?: O) => P) {
    try {
        let pay = f(p)
        return pay.address ? pay.address : undefined;        
    } catch (err) {
        return undefined;
    }
}

export function encodeAddress(hex: string, format: Script) {
    const hash = Buffer.from(hex, 'hex');

    switch (format) {
        case Script.p2sh:
            return encode({hash: hash, network: NETWORK}, bitcoin.payments.p2sh);
        case Script.p2pkh:
            return encode({hash: hash, network: NETWORK}, bitcoin.payments.p2pkh);
        case Script.p2wpkh:
            return encode({hash: hash, network: NETWORK}, bitcoin.payments.p2wpkh);
    }
}
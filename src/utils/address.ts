import * as bitcoin from 'bitcoinjs-lib';
import { Script } from "@interlay/xopts";

const NETWORK = bitcoin.networks.testnet;

function decode<P extends bitcoin.Payment, O>(p: P, f: (payment: P, options?: O) => P, t: Script): { hash: string, format: Script} | undefined {
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

function toAddress<P extends bitcoin.Payment, O>(p: P, f: (payment: P, options?: O) => P) {
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
            return toAddress({hash: hash, network: NETWORK}, bitcoin.payments.p2sh);
        case Script.p2pkh:
            return toAddress({hash: hash, network: NETWORK}, bitcoin.payments.p2pkh);
        case Script.p2wpkh:
            return toAddress({hash: hash, network: NETWORK}, bitcoin.payments.p2wpkh);
    }
}

function toOutput<P extends bitcoin.Payment, O>(p: P, f: (payment: P, options?: O) => P) {
    try {
        let pay = f(p)
        return pay.output ? pay.output : undefined;        
    } catch (err) {
        return undefined;
    }
}

export function encodeOutput(hex: string, format: Script) {
    const hash = Buffer.from(hex, 'hex');

    switch (format) {
        case Script.p2sh:
            return toOutput({hash: hash, network: NETWORK}, bitcoin.payments.p2sh);
        case Script.p2pkh:
            return toOutput({hash: hash, network: NETWORK}, bitcoin.payments.p2pkh);
        case Script.p2wpkh:
            return toOutput({hash: hash, network: NETWORK}, bitcoin.payments.p2wpkh);
    }
}
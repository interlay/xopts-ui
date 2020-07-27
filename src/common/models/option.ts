export default class Option {
    contract: string;
    expiry: string;
    hasSellers: boolean;
    premium: string;
    spotPrice: number;
    strikePrice: string;

    constructor (contract: string, expiry: string, hasSellers: boolean, premium: string, spotPrice: number,
        strikePrice:string) {
        this.contract = contract;
        this.expiry = expiry;
        this.premium = premium;
        this.hasSellers = hasSellers;
        this.spotPrice = spotPrice;
        this.strikePrice = strikePrice;
    }
}
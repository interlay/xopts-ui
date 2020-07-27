export default class Position {
    contract: string;
    expiry: Date;
    premium: string;

    constructor(contracts: string, expiry: Date, premium: string) {
        this.contract = contracts;
        this.expiry = expiry;
        this.premium = premium;
    }
}
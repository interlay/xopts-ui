import Option from "../models/option";
import Position from "../models/position";
import User from "../models/user";

export class Action {
    type: string;
    payload: any;
    constructor (type: string,payload: any) {
        this.type = type;
        this.payload = payload;   
    }
}

export class Store {
    options: Option[];
    positions: Position[];
    user: User;
    constructor (options: Option[], positions: Position[], user: User){
        this.options = options;
        this.positions = positions;
        this.user = user;
    }
}

export interface Window { 
    web3: any;
    ethereum: any
}

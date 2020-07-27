import Option from "../models/option";
import Position from "../models/position";

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
    constructor (options: Option[],positions: Position[]){
        this.options = options;
        this.positions = positions;
    }
}

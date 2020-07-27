import { Action } from "../types/util";
import Position from "../models/position";

const initialState: Position[] = [];

export const positionsReducer = (state: Position[] = initialState, action: Action): Position[] => {
    switch(action.type) {
    default: return state;
    }
};
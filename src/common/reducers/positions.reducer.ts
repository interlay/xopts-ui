import { Position } from "../types/util.types";
import { PositionsActions, ADD_POSITIONS } from "../types/actions.types";

const initialState: Position[] = [];

export const positionsReducer = (state: Position[] = initialState, action: PositionsActions) : Position[] => {
    switch(action.type) {
    case ADD_POSITIONS:
        return {...state, ...action.positions};
    default: return state;
    }
};


import { PositionsActions, ADD_POSITIONS } from "../types/actions.types";
import { Currency, ERC20, Position } from "@interlay/xopts";

const initialState: Position<Currency, ERC20>[] = [];

export const positionsReducer = (
    state: Position<Currency, ERC20>[] = initialState,
    action: PositionsActions
): Position<Currency, ERC20>[] => {
    switch (action.type) {
    case ADD_POSITIONS:
        return action.positions;
    default:
        return state;
    }
};

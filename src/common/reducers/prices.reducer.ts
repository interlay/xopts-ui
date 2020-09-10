import { Prices } from "../types/util.types";
import { UpdatePrices, UPDATE_PRICES } from "../types/actions.types";

const initialState: Prices = {btc: 0, eth: 0};

export const pricesReducer = (state: Prices = initialState, action: UpdatePrices) : Prices => {
    switch(action.type) {
    case UPDATE_PRICES:
        return {...state, ...action.prices};
    default: return state;
    }
};


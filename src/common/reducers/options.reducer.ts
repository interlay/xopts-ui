import { Action } from "../utils/util.types";
import Option from "../models/option";
import { ADD_OPTION } from "../actions/options.actions";

const initialState: Option[] = [];

export const optionsReducer = (state: Option[] = initialState, action: Action) : Option[] => {
    switch(action.type) {
    case ADD_OPTION: 
        return [...state, action.payload];
    default: return state;
    }
};
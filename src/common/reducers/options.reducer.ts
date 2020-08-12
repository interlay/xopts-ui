import { Option } from "../types/util.types";
import { OptionsActions, ADD_OPTIONS } from "../types/actions.types";

const initialState: Option[] = [];

export const optionsReducer = (state: Option[] = initialState, action: OptionsActions) : Option[] => {
    switch(action.type) {
    case ADD_OPTIONS: 
        return action.options;
    default: return state;
    }
};
import { LibActions, LIB_LOADED } from "../types/actions.types";
import {LibState} from "../types/util.types";

const initialState: LibState = {
    isROConnected: false,
    isRWConnected: false,
};

export const libReducer = (
    state = initialState,
    action: LibActions
): LibState => {
    let override;
    switch (action.type) {
    case LIB_LOADED:
        override = {
            isROConnected: true,
            isRWConnected: action.readWrite ? true : false,
        };
        return {...state, ...override};
    default:
        return state;
    }
};

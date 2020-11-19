import { LibActions, LIB_LOADED } from "../types/actions.types";
import {LibState} from "../types/util.types";

const initialState: LibState = {
    isLoaded: false,
    isMock: false,
    isSigner: false,
};

export const libReducer = (
    state = initialState,
    action: LibActions
): LibState => {
    switch (action.type) {
    case LIB_LOADED:
        return {...state, ...action.state, isLoaded: true};
    default:
        return state;
    }
};

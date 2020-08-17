
import { UIState } from "../types/util.types";
import { UIActions, TOGGLE_SIDE_MENU } from "../types/actions.types";

const initialState = {
    isSideCollapsed: false
}

export const uiReducer = (state: UIState = initialState, action: UIActions): UIState => {
    switch (action.type) {
        case TOGGLE_SIDE_MENU:
            return {...state, isSideCollapsed: action.isSideCollapsed};
        default: return state;
    }
}
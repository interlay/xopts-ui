
import { UIState } from "../types/util.types";
import { UIActions, TOGGLE_SIDE_MENU, CHANGE_SELECTED_EXPIRY } from "../types/actions.types";

const initialState = {
    isSideCollapsed: false,
    selectedExpiry: -1
};

export const uiReducer = (state: UIState = initialState, action: UIActions): UIState => {
    switch (action.type) {
    case TOGGLE_SIDE_MENU:
        return {...state, isSideCollapsed: action.isSideCollapsed};
    case CHANGE_SELECTED_EXPIRY:
        return {...state, selectedExpiry: action.selectedExpiry};
    default: return state;
    }
};

import { UIState } from "../types/util.types";
import { UIActions, TOGGLE_SIDE_MENU, CHANGE_SELECTED_PAGE } from "../types/actions.types";

const initialState = {
    isSideCollapsed: false,
    selectedPage: "all-expirations"
};

export const uiReducer = (state: UIState = initialState, action: UIActions): UIState => {
    switch (action.type) {
    case TOGGLE_SIDE_MENU:
        return {...state, isSideCollapsed: action.isSideCollapsed};
    case CHANGE_SELECTED_PAGE:
        return {...state, selectedPage: action.selectedPage};
    default: return state;
    }
};
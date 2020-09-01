
import { UIState } from "../types/util.types";
import { UIActions, TOGGLE_SIDE_MENU, CHANGE_SELECTED_PAGE, CHANGE_CURRENCY } from "../types/actions.types";

const initialState = {
    isSideCollapsed: false,
    selectedPage: "all-expirations",
    currency: "btc"
};

export const uiReducer = (state: UIState = initialState, action: UIActions): UIState => {
    switch (action.type) {
    case TOGGLE_SIDE_MENU:
        return {...state, isSideCollapsed: action.isSideCollapsed};
    case CHANGE_SELECTED_PAGE:
        return {...state, selectedPage: action.selectedPage};
    case CHANGE_CURRENCY:
        return {...state, currency: action.currency};
    default: return state;
    }
};

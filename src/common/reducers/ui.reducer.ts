
import { UIState } from "../types/util.types";
import { UIActions, CHANGE_SELECTED_PAGE, CHANGE_CURRENCY, CHANGE_CLICKED_OPTION } from "../types/actions.types";

const initialState = {
    selectedPage: "all-expirations",
    currency: "btc",
    clickedOption: undefined
};

export const uiReducer = (state: UIState = initialState, action: UIActions): UIState => {
    switch (action.type) {
    case CHANGE_SELECTED_PAGE:
        return {...state, selectedPage: action.selectedPage};
    case CHANGE_CURRENCY:
        return {...state, currency: action.currency};
    case CHANGE_CLICKED_OPTION:
        return {...state, clickedOption: action.clickedOption}
    default: return state;
    }
};

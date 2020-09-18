
import { UIState } from "../types/util.types";
import { UIActions, CHANGE_SELECTED_PAGE, CHANGE_CURRENCY, CHANGE_CLICKED_OPTION, TOGGLE_MODAL, ADD_MODAL } from "../types/actions.types";
import { ModalDataType } from "../types/util.types";

const initialState = {
    selectedPage: "all-expirations",
    currency: "btc",
    clickedOption: undefined,
    modals: []
};

export const uiReducer = (state: UIState = initialState, action: UIActions): UIState => {
    switch (action.type) {
    case CHANGE_SELECTED_PAGE:
        return {...state, selectedPage: action.selectedPage};
    case CHANGE_CURRENCY:
        return {...state, currency: action.currency};
    case CHANGE_CLICKED_OPTION:
        return {...state, clickedOption: action.clickedOption}
    case ADD_MODAL: 
        let found = false;
        let modalArray :ModalDataType[] = [];
        state.modals.forEach((modal) => {
            if(modal.name!==action.name) {
                modalArray.push({name: modal.name, show: modal.show});
            } else {
                found = true;
            }
        });
        if (!found) {
            modalArray.push({name: action.name, show: false});
        }
        return {...state, modals: modalArray};
    case TOGGLE_MODAL:
        let modals: ModalDataType[] = [];
        state.modals.forEach((modal) => {
            if(modal.name===action.name) {
                modals.push({name: modal.name, show: action.show});
            }else {
                modals.push({name: modal.name, show: modal.show});
            }
        });
        return {...state, modals};
    default: return state;
    }
};

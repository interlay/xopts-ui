import { Option } from "../../common/types/util.types";
import { Currency, ERC20 } from "@interlay/xopts";
import { OptionsActions, ADD_OPTIONS } from "../types/actions.types";

const initialState: Option<Currency, ERC20>[] = [];

export const optionsReducer = (
    state: Option<Currency, ERC20>[] = initialState,
    action: OptionsActions
): Option<Currency, ERC20>[] => {
    switch (action.type) {
    case ADD_OPTIONS:
        return action.options;
    default:
        return state;
    }
};

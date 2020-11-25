import { Option } from "../types/util.types";
import {
    CHANGE_SELECTED_PAGE,
    CHANGE_CURRENCY,
    CHANGE_CLICKED_OPTION,
    TOGGLE_MODAL,
    ADD_MODAL,
    ChangeSelectedPage,
    ChangeCurrency,
    ChangeClickedOption,
    ToggleModal,
    AddModal,
} from "../types/actions.types";
import { Currency, ERC20 } from "@interlay/xopts";

export const changeSelectedPageAction = (
    selectedPage: string
): ChangeSelectedPage => ({
    type: CHANGE_SELECTED_PAGE,
    selectedPage,
});

export const changeCurrencyAction = (currency: string): ChangeCurrency => ({
    type: CHANGE_CURRENCY,
    currency,
});

export const changeClickedOptionAction = (
    clickedOption: Option<Currency, ERC20>
): ChangeClickedOption => ({
    type: CHANGE_CLICKED_OPTION,
    clickedOption,
});

export const toggleModalAction = (
    name: string,
    show: boolean
): ToggleModal => ({
    type: TOGGLE_MODAL,
    name,
    show,
});

export const addModalAction = (name: string): AddModal => ({
    type: ADD_MODAL,
    name,
});

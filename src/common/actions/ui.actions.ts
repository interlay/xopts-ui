import { Option } from "../types/util.types";
import { CHANGE_SELECTED_PAGE, CHANGE_CURRENCY, CHANGE_CLICKED_OPTION, 
    ChangeSelectedPage, ChangeCurrency, ChangeClickedOption } from "../types/actions.types";

export const changeSelectedPageAction = (selectedPage: string): ChangeSelectedPage => ({
    type: CHANGE_SELECTED_PAGE,
    selectedPage
});

export const changeCurrencyAction = (currency: string): ChangeCurrency => ({
    type: CHANGE_CURRENCY,
    currency
});

export const changeClickedOptionAction = (clickedOption: Option): ChangeClickedOption => ({
    type: CHANGE_CLICKED_OPTION,
    clickedOption
});

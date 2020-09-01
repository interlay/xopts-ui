import { TOGGLE_SIDE_MENU, CHANGE_SELECTED_PAGE, CHANGE_CURRENCY, 
    ToggleSideMenu, ChangeSelectedPage, ChangeCurrency } from "../types/actions.types";

export const toggleSideMenuAction = (isSideCollapsed: boolean): ToggleSideMenu => ({
    type: TOGGLE_SIDE_MENU,
    isSideCollapsed
});

export const changeSelectedPageAction = (selectedPage: string): ChangeSelectedPage => ({
    type: CHANGE_SELECTED_PAGE,
    selectedPage
});

export const changeCurrencyAction = (currency: string): ChangeCurrency => ({
    type: CHANGE_CURRENCY,
    currency
});

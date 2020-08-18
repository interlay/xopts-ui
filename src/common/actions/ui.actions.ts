import { TOGGLE_SIDE_MENU, CHANGE_SELECTED_EXPIRY, ToggleSideMenu, ChangeSelectedExpiry } from "../types/actions.types";

export const toggleSideMenuAction = (isSideCollapsed: boolean): ToggleSideMenu => ({
    type: TOGGLE_SIDE_MENU,
    isSideCollapsed
});

export const changeSelectedExpiryAction = (selectedExpiry: number): ChangeSelectedExpiry => ({
    type: CHANGE_SELECTED_EXPIRY,
    selectedExpiry
});
import { TOGGLE_SIDE_MENU, ToggleSideMenu } from "../types/actions.types";

export const toggleSideMenuAction = (isSideCollapsed: boolean): ToggleSideMenu => ({
    type: TOGGLE_SIDE_MENU,
    isSideCollapsed
});
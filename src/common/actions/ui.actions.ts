import { TOGGLE_SIDE_MENU, CHANGE_SELECTED_PAGE, ToggleSideMenu, ChangeSelectedPage } from "../types/actions.types";

export const toggleSideMenuAction = (isSideCollapsed: boolean): ToggleSideMenu => ({
    type: TOGGLE_SIDE_MENU,
    isSideCollapsed
});

export const changeSelectedPageAction = (selectedPage: string): ChangeSelectedPage => ({
    type: CHANGE_SELECTED_PAGE,
    selectedPage
});

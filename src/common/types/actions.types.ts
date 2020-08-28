import { Option, Position } from "../types/util.types";

// USER

export const UPDATE_IS_USER_CONNECTED = "UPDATE_IS_USER_CONNECTED";
export const UPDATE_USER_NETWORK = "UPDATE_USER_NETWORK";

export interface UpdateIsUserConnected{
    type: typeof UPDATE_IS_USER_CONNECTED;
    isConnected: boolean;
}

export interface UpdateUserNetwork{
    type: typeof UPDATE_USER_NETWORK;
    network: string;
}

export type UserActions = UpdateIsUserConnected | UpdateUserNetwork | AddPositions;

// OPTIONS

export const ADD_OPTIONS = "ADD_OPTIONS";

export interface AddOptions{
    type: typeof ADD_OPTIONS;
    options: Option[];
}

export type OptionsActions = AddOptions;

// POSITIONS

export const ADD_POSITIONS = "ADD_POSITIONS";

export interface AddPositions{
    type: typeof ADD_POSITIONS;
    positions: Position[];
}

export type PositionsActions = AddPositions;

// UI

export const TOGGLE_SIDE_MENU = "TOGGLE_SIDE_MENU";

export interface ToggleSideMenu{
    type: typeof TOGGLE_SIDE_MENU;
    isSideCollapsed: boolean;
}

export const CHANGE_SELECTED_PAGE = "CHANGE_SELECTED_PAGE";

export interface ChangeSelectedPage{
    type: typeof CHANGE_SELECTED_PAGE;
    selectedPage: string;
}

export type UIActions = ToggleSideMenu | ChangeSelectedPage;

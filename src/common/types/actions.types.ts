import { Option, Position, Prices } from "../types/util.types";


// USER

export const UPDATE_IS_USER_CONNECTED = "UPDATE_IS_USER_CONNECTED";
export const UPDATE_USER_NETWORK = "UPDATE_USER_NETWORK";
export const UPDATE_USER_DATA =  "UPDATE_USER_DATA";

export interface UpdateIsUserConnected{
    type: typeof UPDATE_IS_USER_CONNECTED;
    isConnected: boolean;
    account?: string
}

export interface UpdateUserNetwork{
    type: typeof UPDATE_USER_NETWORK;
    network: string;
}

export interface UpdateUserData{
    type: typeof UPDATE_USER_DATA;
    btcAddress: string;
    email: string;
    hour: boolean;
    day: boolean;
    threedays: boolean;
    confirmed: boolean;
}

export type UserActions = UpdateIsUserConnected | UpdateUserNetwork | AddPositions | UpdateUserData;


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

export const CHANGE_SELECTED_PAGE = "CHANGE_SELECTED_PAGE";
export const CHANGE_CURRENCY = "CHANGE_CURRENCY";
export const CHANGE_CLICKED_OPTION = "CHANGE_CLICKED_OPTION";
export const TOGGLE_MODAL = "TOGGLE_MODAL";
export const ADD_MODAL = "ADD_MODAL";

export interface ChangeSelectedPage{
    type: typeof CHANGE_SELECTED_PAGE;
    selectedPage: string;
}

export interface ChangeCurrency{
    type: typeof CHANGE_CURRENCY;
    currency: string;
}

export interface ChangeClickedOption{
    type: typeof CHANGE_CLICKED_OPTION;
    clickedOption: Option;
}

export interface ToggleModal{
    type: typeof TOGGLE_MODAL;
    show: boolean;
    name: string;
}

export interface AddModal{
    type: typeof ADD_MODAL;
    name: string;
}

export type UIActions = ChangeSelectedPage | ChangeCurrency | ChangeClickedOption | ToggleModal | AddModal;

// PRICES

export const UPDATE_PRICES = "UPDATE_PRICES";

export interface UpdatePrices {
    type: typeof UPDATE_PRICES;
    prices: Prices;
}

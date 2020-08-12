import { Option, Position } from "../types/util.types";

// user actions types
export const UPDATE_IS_USER_CONNECTED = "UPDATE_IS_USER_CONNECTED";
export const UPDATE_USER_NETWORK = "UPDATE_USER_NETWORK";
export const ADD_POSITIONS = "ADD_POSITIONS";

export interface UpdateIsUserConnected{
    type: typeof UPDATE_IS_USER_CONNECTED;
    isConnected: boolean;
}

export interface UpdateUserNetwork{
    type: typeof UPDATE_USER_NETWORK;
    network: string;
}

export interface AddPositions{
    type: typeof ADD_POSITIONS;
    positions: Position[];
}

export type UserActions = UpdateIsUserConnected | UpdateUserNetwork | AddPositions;

// options actions types

export const ADD_OPTIONS = "ADD_OPTIONS";

export interface AddOptions{
    type: typeof ADD_OPTIONS;
    options: Option[];
}

export type OptionsActions = AddOptions;
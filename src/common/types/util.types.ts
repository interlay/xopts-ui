import { rootReducer } from "../reducers/index";
import { Store, CombinedState } from "redux";
import { AddOptions, UpdateIsUserConnected, UpdateUserNetwork, AddPositions, ToggleSideMenu } from "./actions.types";

export interface User {
    isConnected: boolean;
    network: string;
}

export interface Option {
    contract: string;
    expiry: string;
    strikePrice: string;
    spotPrice: number;
    liquidity: string;
}

export interface Position {
    contract: string;
    expiry: string;
    premium: string;
}

export type UIState = {
    isSideCollapsed: boolean;
}

export type AppState = ReturnType<typeof rootReducer>

export type StoreType = {
    options: Option[];
    user: User;
    positions: Position[];
    ui: UIState
}

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {}; 
}

export type StoreState = Store<CombinedState<StoreType>, 
AddOptions | UpdateIsUserConnected | UpdateUserNetwork | AddPositions | ToggleSideMenu> & dispatcher
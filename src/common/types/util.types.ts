import { rootReducer } from "../reducers/index";
import { Store, CombinedState } from "redux";
import { AddOptions, 
    UpdateIsUserConnected, 
    UpdateUserNetwork, 
    AddPositions, 
    ChangeSelectedPage, 
    ChangeCurrency,
    UpdatePrices,
    ChangeClickedOption,
    UpdateUserData,
    UpdateUserNotifications
} from "./actions.types";

export interface Prices {
    btc: number;
    eth: number;
}

export interface User {
    isConnected: boolean;
    network: string;
    account?: string;
    btcAddress: string;
    email: string;
    notifications: {
        hour: boolean;
        day: boolean;
        threedays: boolean;
        week: boolean;
        confirmed: boolean;
    }
}

export interface Option {
    contract: string;
    expiry: number;
    strikePrice: number;
    spotPrice: number;
    liquidity: number;
}

export interface Position {
    contract: string;
    expiry: string;
    premium: string;
}

export type UIState = {
    selectedPage: string;
    currency: string;
    clickedOption?: Option;
}

export type AppState = ReturnType<typeof rootReducer>

export type StoreType = {
    options: Option[];
    user: User;
    positions: Position[];
    ui: UIState;
    prices: Prices;
}

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {}; 
}

export type StoreState = Store<CombinedState<StoreType>, 
AddOptions | UpdateIsUserConnected | UpdateUserNetwork | AddPositions | ChangeSelectedPage | 
ChangeCurrency | UpdatePrices | ChangeClickedOption | UpdateUserData | UpdateUserNotifications> 
& dispatcher

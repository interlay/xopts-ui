import Big from "big.js";
import { rootReducer } from "../reducers/index";
import { Currency, ERC20, Option as LibOption } from "@interlay/xopts";
import { Store, CombinedState } from "redux";
import {
    AddOptions,
    UpdateIsUserConnected,
    UpdateUserNetwork,
    AddPositions,
    ChangeSelectedPage,
    ChangeCurrency,
    UpdatePrices,
    ChangeClickedOption,
    UpdateUserData,
    ToggleModal,
    AddModal,
    SetLibLoaded,
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
        confirmed: boolean;
    };
}

export interface Option<Underlying extends Currency, Collateral extends ERC20>
    extends LibOption<Underlying, Collateral> {
        spotPrice: number;
        liquidity: number;
        strikeNum: Big;
    }

export interface Position {
    contract: string;
    expiry: string;
    premium: string;
}

export type ModalDataType = {
    name: string;
    show: boolean;
};

export type UIState = {
    selectedPage: string;
    currency: string;
    clickedOption?: Option<Currency, ERC20>;
    modals: ModalDataType[];
};

export type LibState = {
    isLoaded: boolean;
    isMock: boolean;
    isSigner: boolean;
}

export type AppState = ReturnType<typeof rootReducer>;

export type StoreType = {
    options: Option<Currency, ERC20>[];
    user: User;
    positions: Position[];
    ui: UIState;
    prices: Prices;
    lib: LibState;
};

export type dispatcher = {
    // eslint-disable-next-line
    dispatch: {};
};

export type StoreState = Store<
    CombinedState<StoreType>,
    | AddOptions
    | UpdateIsUserConnected
    | UpdateUserNetwork
    | AddPositions
    | ChangeSelectedPage
    | ChangeCurrency
    | UpdatePrices
    | ChangeClickedOption
    | UpdateUserData
    | ToggleModal
    | AddModal
    | SetLibLoaded
> &
    dispatcher;

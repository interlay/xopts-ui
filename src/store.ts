import { rootReducer } from "./common/reducers/index";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { errorToast } from "./common/utils/toast";
import { AppState, StoreType, StoreState } from "./common/types/util.types";
import i18n from "i18next";
import {XOpts, SignerOrProvider} from "@interlay/xopts";

declare global {
    interface Window {
        provider: SignerOrProvider;
        xopts: XOpts<SignerOrProvider>;
    }
}

export const loadState = (): StoreType => {
    const emptyStore: StoreType = {
        positions: [],
        options: [],
        user: {
            isConnected: false,
            account: undefined,
            network: "",
            btcAddress: "",
            email: "",
            notifications: {
                hour: false,
                day: false,
                threedays: false,
                confirmed: false,
            },
        },
        ui: {
            selectedPage: "all-expirations",
            currency: "btc",
            clickedOption: undefined,
            modals: [],
        },
        prices: { btc: 0, eth: 0 },
        lib: {isLoaded: false, isMock: false, isSigner: false},
    };
    return emptyStore; // disable localStorage loading for now
    // try {
    //     const serializedState = localStorage.getItem("store");
    //     if (serializedState === null) {
    //         return emptyStore;
    //     }
    //     return JSON.parse(serializedState);
    // } catch (error) {
    //     setTimeout(() => errorToast(i18n.t("enable_localstorage")), 2000);
    //     return emptyStore;
    // }
};

export const saveState = (store: AppState): void => {
    try {
        const serializedState = JSON.stringify(store);
        localStorage.setItem("store", serializedState);
    } catch (error) {
        setTimeout(() => errorToast(i18n.t("enable_localstorage")), 2000);
    }
};

export const configureStore = (): StoreState => {
    const storeLogger = createLogger();
    const store = createStore(
        rootReducer,
        loadState(),
        composeWithDevTools(applyMiddleware(storeLogger))
    );
    store.subscribe(() => {
        saveState(store.getState());
    });
    return store;
};


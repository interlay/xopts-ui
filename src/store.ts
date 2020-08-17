import { rootReducer } from "./common/reducers/index";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { errorToast } from "./common/utils/toast";
import { AppState, StoreType, StoreState } from "./common/types/util.types";
import i18n from "i18next";

export const loadState = (): StoreType => {
    const emptyStore = { positions: [], options: [], 
        user: { isConnected: false, network: "" }, 
        ui: {isSideCollapsed: false} };
    try {
        const serializedState = localStorage.getItem("store");
        if (serializedState === null) {
            return emptyStore;
        }
        return JSON.parse(serializedState);
    } catch(error) {
        setTimeout(()=>errorToast(i18n.t("enable_localstorage")), 2000);
        return emptyStore;
    }
};

export const saveState = (store: AppState): void => {
    try {
        const serializedState = JSON.stringify(store);
        localStorage.setItem("store", serializedState);
    } catch(error) {
        setTimeout(()=>errorToast(i18n.t("enable_localstorage")), 2000);
    }
};

export const configureStore = (): StoreState => {
    const storeLogger = createLogger();
    const store = createStore(rootReducer,loadState(),applyMiddleware(storeLogger));
    store.subscribe(() => {
        saveState(store.getState());
    });
    return store;
};
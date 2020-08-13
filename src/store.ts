import { rootReducer } from "./common/reducers/index";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { errorToast } from "./common/utils/toast";
import i18n from "i18next";

export type AppState = ReturnType<typeof rootReducer>

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("store");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch(error) {
        setTimeout(()=>errorToast(i18n.t("enable_localstorage")), 2000);

    }
};

export const saveState = (store: AppState) => {
    try {
        const serializedState = JSON.stringify(store);
        localStorage.setItem("store", serializedState);
    } catch(error) {
        setTimeout(()=>errorToast(i18n.t("enable_localstorage")), 2000);
    }
};

export const configureStore = () => {
    const storeLogger = createLogger();
    const store = createStore(rootReducer,loadState(),applyMiddleware(storeLogger));
    store.subscribe(() => {
        saveState(store.getState());
    });
    return store;
};
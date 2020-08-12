import { rootReducer } from "./common/reducers/index";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";

export type AppState = ReturnType<typeof rootReducer>

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem("store");
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch(error) {
        return undefined;
    }
};

export const saveState = (store: AppState) => {
    try {
        const serializedState = JSON.stringify(store);
        localStorage.setItem("store", serializedState);
    } catch(error) {
        console.log("Local Storage is disabled, please enable local storage");
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
import { Action } from "./common/utils/util.types";

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

export const saveState = (state: any) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem("store", serializedState);
    } catch(error) {
        console.log("Local Storage in disabled, please enable local storage");
    }
};

export const actionMiddleware = (store: any) => (next: any) => (action: any) => {
    let plainAction = action;
  
    if (action instanceof Action){
        plainAction = {...action};
        plainAction.__classAction = action;
    }
    next(plainAction);
};
import { UserActions, UPDATE_USER_NETWORK } from "../types/actions.types";
import { User } from "../types/util.types";
import { UPDATE_IS_USER_CONNECTED } from "../types/actions.types";

const initialState: User = {
    isConnected: false, 
    network: ""
};

export const userReducer = (state: User = initialState, action: UserActions) : User => {
    switch(action.type) {
    case UPDATE_IS_USER_CONNECTED: 
        return {...state, isConnected: action.isConnected};
    case UPDATE_USER_NETWORK:
        return {...state, network: action.network};
    default: return state;
    }
};
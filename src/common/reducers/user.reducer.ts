import { UserActions, UPDATE_USER_NETWORK, UPDATE_USER_DATA } from "../types/actions.types";
import { User } from "../types/util.types";
import { UPDATE_IS_USER_CONNECTED } from "../types/actions.types";

const initialState: User = {
    isConnected: false, 
    account: undefined,
    network: "",
    btcAddress: "",
    email: ""
};

export const userReducer = (state: User = initialState, action: UserActions) : User => {
    switch(action.type) {
    case UPDATE_IS_USER_CONNECTED: 
        return {...state, isConnected: action.isConnected, account: action.account};
    case UPDATE_USER_NETWORK:
        return {...state, network: action.network};
    case UPDATE_USER_DATA:
            return {...state, btcAddress: action.btcAddress, email: action.email}
    default: return state;
    }
};
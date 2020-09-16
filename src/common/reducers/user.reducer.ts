import { UserActions, UPDATE_USER_NETWORK, UPDATE_USER_DATA, UPDATE_USER_NOTIFICATIONS } from "../types/actions.types";
import { User } from "../types/util.types";
import { UPDATE_IS_USER_CONNECTED } from "../types/actions.types";

const initialState: User = {
    isConnected: false, 
    account: undefined,
    network: "",
    btcAddress: "",
    email: "",
    notifications: { hour: false, day: false, threedays: false, week: false, confirmed: false }
};

export const userReducer = (state: User = initialState, action: UserActions) : User => {
    switch(action.type) {
    case UPDATE_IS_USER_CONNECTED: 
        return {...state, isConnected: action.isConnected, account: action.account};
    case UPDATE_USER_NETWORK:
        return {...state, network: action.network};
    case UPDATE_USER_DATA:
            return {...state, btcAddress: action.btcAddress, email: action.email, notifications: {
                hour: action.hour, 
                day: action.day,
                threedays: action.threedays,
                week: action.week,
                confirmed: action.confirmed
                }
            };
    case UPDATE_USER_NOTIFICATIONS:
        return {...state, notifications: {
            hour: action.hour,
            day: action.day,
            threedays: action.threedays,
            week: action.week,
            confirmed: action.confirmed
        }};
    default: return state;
    }
};
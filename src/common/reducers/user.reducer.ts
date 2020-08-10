import { Action } from "../utils/util.types";
import User from "../models/user";
import { UPDATE_USER } from "../actions/user.actions";

const initialState: User = new User();

export const userReducer = (state: User = initialState, action: Action) : User => {
    switch(action.type) {
    case UPDATE_USER: 
        return { ...state, ...action.payload };
    default: return state;
    }
};
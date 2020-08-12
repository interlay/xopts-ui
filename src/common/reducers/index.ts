import {combineReducers} from "redux";
import { optionsReducer as options } from "./options.reducer";
import { userReducer as user } from "./user.reducer";

export const rootReducer = combineReducers({
    options,
    user
});
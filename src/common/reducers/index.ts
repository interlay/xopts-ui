import {combineReducers} from "redux";
import { positionsReducer as positions } from "./positions.reducer";
import { optionsReducer as options } from "./options.reducer";
import { userReducer as user } from "./user.reducer";

export const rootReducer = combineReducers({
    positions,
    options,
    user
});
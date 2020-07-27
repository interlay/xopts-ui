import {combineReducers} from "redux";
import { positionsReducer as positions } from "./positions.reducer";
import { optionsReducer as options } from "./options.reducer";

export const rootReducer = combineReducers({
    positions,
    options
});
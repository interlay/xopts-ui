import {combineReducers} from "redux";
import { optionsReducer as options } from "./options.reducer";
import { userReducer as user } from "./user.reducer";
import { positionsReducer as positions } from "./positions.reducer";
import { uiReducer as ui } from "./ui.reducer";
import { pricesReducer as prices } from "./prices.reducer";
import {libReducer as lib} from "./lib.reducer";

export const rootReducer = combineReducers({
    options,
    user,
    positions,
    ui,
    prices,
    lib,
});

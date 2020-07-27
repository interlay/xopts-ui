import { Action } from "../types/util";
import Option from "../models/option";

export const ADD_OPTION = "ADD_OPTION";

export default function addOptionAction(payload: Option): Action {
    return new Action(ADD_OPTION,payload);
}
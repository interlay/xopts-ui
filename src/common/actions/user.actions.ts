import { Action } from "../utils/util.types";

export const UPDATE_USER = "UPDATE_USER";

export default function updateUserAction(payload: any): Action {
    return new Action(UPDATE_USER,payload);
}
import { Option } from "../types/util.types";
import { AddOptions, ADD_OPTIONS } from "../types/actions.types";

export const addOptionsAction = (options: Option[]): AddOptions => ({
    type: ADD_OPTIONS,
    options
});
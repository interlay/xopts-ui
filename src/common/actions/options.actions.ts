import { Option } from "../../common/types/util.types";
import { Currency, ERC20 } from "@interlay/xopts";
import { AddOptions, ADD_OPTIONS } from "../types/actions.types";

export const addOptionsAction = (
    options: Option<Currency, ERC20>[]
): AddOptions => ({
    type: ADD_OPTIONS,
    options,
});

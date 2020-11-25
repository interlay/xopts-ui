import { SetLibLoaded, LIB_LOADED } from "../types/actions.types";

export const loadLibAction = (readWrite: boolean): SetLibLoaded => ({
    type: LIB_LOADED,
    readWrite,
});

import { SetLibLoaded, LIB_LOADED } from "../types/actions.types";

export const loadLibAction = (isLoaded = false, isSigner = false, isMock = false): SetLibLoaded => ({
    type: LIB_LOADED,
    state: { isLoaded, isMock, isSigner }
});

import { StoreState } from "../types/util.types";
import { updateIsUserConnectedAction } from "../actions/user.actions";
import { fireLoading } from "./reloadLib";
import { USE_MOCK_LIB } from "../../config";

export default function subscribeOnEvents(store: StoreState): void {
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
        store.dispatch(
            updateIsUserConnectedAction(accounts.length > 0, accounts[0])
        );
        fireLoading(store.dispatch, USE_MOCK_LIB);
    });
}

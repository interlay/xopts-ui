import { StoreState } from "../types/util.types";
import { updateIsUserConnectedAction } from "../actions/user.actions";
import {loadLib} from "./reloadLib";
import globals from "../globals";

export default function subscribeOnProviderEvents(store: StoreState, useMockLib = false): void {
    globals.metamaskProvider.on("accountsChanged", (accounts: string[]) => {
        store.dispatch(updateIsUserConnectedAction(accounts.length > 0,accounts[0]));
        loadLib(store, true, useMockLib);
    });
}

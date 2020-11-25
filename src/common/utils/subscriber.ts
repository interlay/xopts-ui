import { StoreState } from "../types/util.types";
import { updateIsUserConnectedAction } from "../actions/user.actions";
import {fireLoading} from "./reloadLib";

export default function subscribeOnEvents(store: StoreState): void {
    window.ethereum.on("accountsChanged", (accounts: string[]) => {
        store.dispatch(updateIsUserConnectedAction(accounts.length > 0,accounts[0]));
        fireLoading(store.dispatch, store.getState().lib.isMock);
    });
}

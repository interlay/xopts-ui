import { StoreState } from "../types/util.types";
import { updateIsUserConnectedAction } from "../actions/user.actions";

export default function subscribeOnEvents(store: StoreState): void {
    window.ethereum.on('accountsChanged', (accounts: string[]) => {        
        store.dispatch(updateIsUserConnectedAction(accounts.length > 0,accounts[0]));
    });
}
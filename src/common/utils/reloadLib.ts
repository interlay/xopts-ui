import {ethers, createXOpts, Deployments} from "@interlay/xopts";
import {loadLibAction} from "../actions/lib.actions";
import globals from "../globals";
import detectEthereumProvider from "@metamask/detect-provider";
import {StoreState} from "../types/util.types";

export const getProvider = async (): Promise<void> => {
    const web3 = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(web3 as ethers.providers.ExternalProvider);
    globals.provider = provider;
};

export const loadLib = async (store: StoreState, readWrite: boolean, useMock = false): Promise<void> => {
    const addresses = useMock ? Deployments.mock : undefined;
    if (readWrite) await globals.metamaskProvider.enable();
    const providerOrSigner = readWrite ? globals.signer : globals.provider;

    const xopts = await createXOpts(providerOrSigner, addresses);
    globals.xopts = xopts;
    store.dispatch(loadLibAction(readWrite));
};

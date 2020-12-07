import { loadLibAction } from "../actions/lib.actions";
import globals from "../globals";
import detectEthereumProvider from "@metamask/detect-provider";
import { StoreState } from "../types/util.types";
import { createXOpts, Deployments, ethers } from "@interlay/xopts";
import { USE_MOCK_LIB } from "../../config";

export const getProvider = async (): Promise<void> => {
    const web3 = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(
        web3 as ethers.providers.ExternalProvider
    );
    globals.provider = provider;
};

export const loadLib = async (store: StoreState): Promise<void> => {
    const web3 = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(
        web3 as ethers.providers.ExternalProvider
    );
    let isSigner = false;
    const addresses = USE_MOCK_LIB ? Deployments.mock : undefined;

    let xopts;
    try {
        // NOTE: getSigner does not fail even if there is no account connected
        // but getAddress will fail
        await globals.metamaskProvider.enable();
        const signer = provider.getSigner();
        await signer.getAddress();
        isSigner = true;
        xopts = await createXOpts(signer, addresses);
    } catch (_ex) {
        xopts = await createXOpts(globals.provider, addresses);
    }

    globals.xopts = xopts;
    store.dispatch(loadLibAction(isSigner));
};

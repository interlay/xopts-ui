import { createXOpts, Deployments, ethers } from "@interlay/xopts";
import { Dispatch } from "react";
import { loadLibAction } from "../actions/lib.actions";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

export const fireLoading = async (
    dispatch: Dispatch<any>,
    useMock: boolean
): Promise<void> => {
    const web3 = await detectEthereumProvider();
    const provider = new ethers.providers.Web3Provider(web3);
    window.provider = provider;
    let isSigner = false;
    const addresses = useMock ? Deployments.mock : undefined;

    try {
        // NOTE: getSigner does not fail even if there is no account connected
        // but getAddress will fail
        const signer = provider.getSigner();
        await signer.getAddress();
        isSigner = true;
        window.xopts = await createXOpts(signer, addresses);
    } catch (_ex) {
        window.xopts = await createXOpts(window.provider, addresses);
    }

    dispatch(loadLibAction(true, isSigner, useMock));
};

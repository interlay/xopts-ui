import {ethers, CreateXOpts, Deployments} from "@interlay/xopts";
import {loadLibAction} from "../actions/lib.actions";
import {Signer} from "@interlay/xopts/dist/lib/core";
import {Dispatch} from "react";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

export const fireLoading = async (dispatch: Dispatch<any>, useMock: boolean): Promise<void> => {
    const web3 = await detectEthereumProvider();
    window.provider = new ethers.providers.Web3Provider(web3);
    const isSigner = window.provider instanceof Signer;

    const addresses = useMock ? Deployments.mock : undefined;
    window.xopts = await CreateXOpts(window.provider, addresses);

    dispatch(loadLibAction(true, isSigner, useMock));
};

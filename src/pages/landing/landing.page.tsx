import React, { ReactElement, useEffect } from "react";
import { ReadWriteContracts, ethers } from "@interlay/xopts";
import { MetaMaskButton } from "../../common/components/meta-mask-button";
import { useDispatch } from "react-redux";
import { updateIsUserConnectedAction } from "../../common/actions/user.actions";

const detectEthereumProvider = require("@metamask/detect-provider");

declare global {
    interface Window { web3: any; ethereum: any; }
}

export default function LandingPage(): ReactElement {
    const dispatch = useDispatch();

    const connectWallet = async (activeLogin: boolean) => {
        const etherProvider = await detectEthereumProvider();
        if (etherProvider) {
            try {
                const account = await etherProvider.request({ method: "eth_requestAccounts" });
                console.log(account);
                const provider = new ethers.providers.Web3Provider(etherProvider);
                // const contracts = (await ReadWriteContracts.resolve(provider))!;
                // const options = await contracts.listOptions();
                // const pair = await contracts.getPair(options[0]);
                // const details = await pair.getDetails();
                dispatch(updateIsUserConnectedAction(true));
            } catch (error) {
                console.log(error);
            }
        } else {
            dispatch(updateIsUserConnectedAction(false));
        }
    };

    useEffect(()=> {
        connectWallet(false);
    });

    return (
        <div>
            <MetaMaskButton { ...{connectWallet}}/>
        </div>
    );
}
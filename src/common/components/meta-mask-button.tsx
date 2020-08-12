import React, { ReactElement, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppState } from "../../store";

type MetaMaskProps = {
    connectWallet: (activeLogin: boolean) => Promise<void>
}

export function MetaMaskButton({connectWallet}: MetaMaskProps): ReactElement {
    
    const isConnected = useSelector((state: AppState) => state.user.isConnected);

    return <React.Fragment>
        {!isConnected && 
        <React.Fragment>
            <button onClick={() => { connectWallet(true); }}> Connect Wallet</button>
            <a className="nav-link" href="https://metamask.io/download.html" target="__blank">
                <button> Get MetaMask</button>
            </a>
        </React.Fragment>
        }
    </React.Fragment>;
}
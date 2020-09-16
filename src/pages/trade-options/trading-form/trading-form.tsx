import React, { ReactElement } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../../common/types/util.types";
import { updateIsUserConnectedAction } from "../../../common/actions/user.actions";

import "./trading-form.scss";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

export default function TradingForm():ReactElement {
    const isConnected = useSelector((state: AppState) => state.user.isConnected);
    const dispatch = useDispatch();
    const selectedOption = useSelector((state: AppState)=>state.ui.clickedOption);

    const connectWallet = async (activeLogin: boolean) => {
        const etherProvider = await detectEthereumProvider();
        const isUnlocked = await etherProvider._metamask.isUnlocked();

        if (etherProvider && (activeLogin || isUnlocked)) {
            try {
                const account = await etherProvider.request({ method: "eth_requestAccounts" });
                console.log(account[0]);
                dispatch(updateIsUserConnectedAction(true,account[0]));
            } catch (error) {
                console.log(error);
            }
        }
    };

    return <div className="trading-form">
        {isConnected ? 
            <React.Fragment>
                <div className="row justify-content-center">
                    <div className="col-12 table-input">
                        Strike Price: {selectedOption && selectedOption.strikePrice}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 table-input">
                        Liquidity {selectedOption && selectedOption.liquidity}
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 table-input">
                        Last Price: 8500
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 table-input">
                        Positions: 0.01
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-12 table-input">
                        <div className="quantity-label">Quantity:</div>
                        <div className="quantity-wrapper">
                            <input id="quantity-input"name="quanity" type="number" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <button className="buy-button" type="submit">
                        Buy &nbsp;&nbsp; <span>573 USDT</span>
                        </button>
                    </div>
                    <div className="col-6">
                        <button className="sell-button" type="submit">
                        Sell &nbsp;&nbsp; <span>1875 USDT</span>
                        </button>
                    </div>
                </div> 
            </React.Fragment>:
            <div className="row justify-content-center">
                <div className="col-6">
                    <button className="confirm-button" onClick={()=>connectWallet(true)}>
                        Start trading
                    </button>
                </div>
            </div>
        }
    </div>;
}
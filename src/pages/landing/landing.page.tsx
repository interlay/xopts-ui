import React, { ReactElement } from "react";
import Page from "../page/page";

import "./landing.page.scss";

declare global {
    // eslint-disable-next-line
    interface Window { web3: any; ethereum: any; }
}

export default function LandingPage(): ReactElement {
    return (
        <Page sideBar={false}>
            <div className="landing-page">
                <div className="title">Zero Trust Bitcoin Options</div>
                <div className="statistics row justify-content-center">
                    <div className="stat col-xl-2">
                        <p>Liquidity</p>
                        <p>55,435,064 USDT</p>
                    </div>
                    <div className="stat col-xl-2">
                        <p>Fees Earned</p>
                        <p>6,678 USDT</p>
                    </div>
                    <div className="stat col-xl-2">
                        <p>Option Markets</p>
                        <p>18</p>
                    </div>
                    <div className="stat col-xl-2">
                        <p>Bitcoin Transfered</p>
                        <p>31.4 USDT</p>
                    </div>
                </div>
                <div className="action-boxes row justify-content-center">
                    <div className="action-box col-xl-3">
                        <div className="box-header">Options</div>
                        <p>
                            Trade Bitcoin options with an AMM for direct execution and optimization of profits.
                        </p>
                        <div className="action-button">Trade Options</div>
                    </div>
                    <div className="action-box col-xl-3">
                        <div className="box-header">Bitcoin</div>
                        <p>
                            Potentially buy Bitcoin at your desired price by providing liquidity. 
                            Buy USDT on Ethereum with you Bitcoin to enter DeFi.
                        </p>
                        <div className="action-button">Trade Bitcoin</div>
                    </div>
                </div>
            </div>
        </Page>
    );
}
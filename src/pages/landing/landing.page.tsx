import React, { ReactElement } from "react";

import "./landing.page.scss";
import { Link } from "react-router-dom";

declare global {
    // eslint-disable-next-line
    interface Window { web3: any; ethereum: any; }
}

export default function LandingPage(): ReactElement {
    return (
        <div className="landing-page">
            <div className="title">Zero Trust Bitcoin Options</div>
            <div className="statistics row justify-content-center">
                <div className="stat col-xl-2 col-lg-3 col-md-6 col-sm-6 col-6">
                    <p>Option Markets</p>
                    <p>18</p>
                </div>
                <div className="stat col-xl-2 col-lg-3 col-md-6 col-sm-6 col-6">
                    <p>Liquidity</p>
                    <p>55,435,064 USDT</p>
                </div>
                <div className="stat col-xl-2 col-lg-3 col-md-6 col-sm-6 col-6">
                    <p>Fees Earned</p>
                    <p>6,678 USDT</p>
                </div>
                <div className="stat col-xl-2 col-lg-3 col-md-6 col-sm-6 col-6">
                    <p>Bitcoin Transfered</p>
                    <p>31.4 USDT</p>
                </div>
            </div>
            <div className="action-boxes row justify-content-center">
                <div className="action-box col-xl-3 col-lg-4 col-md-6 col-sm-11 col-11">
                    <div className="box-header">Options</div>
                    <p>
                        Trade Bitcoin options with an AMM for direct execution and optimization of profits.
                    </p>
                    <Link to="/trade-options">
                        <div className="action-button">
                            Trade Options
                        </div>
                    </Link>
                </div>
                <div className="action-box col-xl-3 col-lg-4 col-md-6 col-sm-11 col-11">
                    <div className="box-header">Bitcoin</div>
                    <p>
                        Potentially buy Bitcoin at your desired price by providing liquidity. 
                        Buy USDT on Ethereum with you Bitcoin to enter DeFi.
                    </p>
                    <Link to="/bitcoin">
                        <div className="action-button">
                            Trade Bitcoin
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
import React, { ReactElement } from "react";

import "./landing.page.scss";
import { Link } from "react-router-dom";

export default function LandingPage(): ReactElement {
    return (
        <div className="landing-page container-fluid">
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
                    <Link to="/trade-options/btc">
                        <div className="action-button">
                            Trade Options
                        </div>
                    </Link>
                </div>
                <div className="action-box col-xl-3 col-lg-4 col-md-6 col-sm-11 col-11">
                    <div className="box-header">Earn</div>
                    <p>
                        Earn interest and potentially buy Bitcoin at your desired price by providing USDT liquidity.
                    </p>
                    <Link to="/earn">
                        <div className="action-button">
                            Provide Liquidity
                        </div>
                    </Link>
                </div>
                <div className="action-box col-xl-3 col-lg-4 col-md-6 col-sm-11 col-11">
                    <div className="box-header">Exchange</div>
                    <p>
                        Get access to Ethereum's DeFi with Bitcoin: trade BTC against USDT, DAI or any many more.
                    </p>
                    <Link to="/exchange">
                        <div className="action-button">
                            Exchange BTC
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}

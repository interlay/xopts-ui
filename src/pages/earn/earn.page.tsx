import React, { ReactElement } from "react";
import Page from "../page/page";
import DepositTab from "./deposit-tab/deposit-tab";
import WithdrawTab from "./withdraw-tab/withdraw-tab";
import { Link } from "react-router-dom";
import { useParams } from "react-router";

import "./earn.page.scss";

export default function EarnPage(): ReactElement{
    const { tab } = useParams();

    return <Page>
        <div className="earn-page container">
            <div className="row">
                <div className="col">
                    <h3>Provide Liquidity</h3>
                </div>
            </div>
            <div className="row stats justify-content-center">
                <div className="col-xl-3">
                    <p>Supply</p>
                    <p>21,000 USDT</p>
                </div>
                <div className="col-xl-3">
                    <p>BTC received</p>
                    <p>1.98 BTC</p>
                </div>
                <div className="col-xl-3">
                    <p>Fees earned</p>
                    <p>89.1 USDT <span className="apy">2.4% APY</span></p>
                </div>
            </div>
            <div className="row">
                <ul className="nav nav-tabs">
                    <li className="nav-item">
                        <Link className={"nav-link " + (tab === "deposit" ? "active": "")} href="#" 
                            to="/earn/deposit">
                            Deposit
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className={"nav-link " + (tab === "withdraw" ? "active": "")} href="#" 
                            to="/earn/withdraw">
                            Withdraw
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="tab-content">
                {tab==="deposit" ? <DepositTab></DepositTab> : <WithdrawTab></WithdrawTab>}
            </div>
        </div>
    </Page>;
}
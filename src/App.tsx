import React, { ReactElement, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import TopNavigation from "./common/components/top-navigation/top-navigation";
import HelpPage from "./pages/help/help.page";
import LandingPage from "./pages/landing/landing.page";
import TradeOptionsPage from "./pages/trade-options/trade-options.page";
import { ToastContainer } from "react-toastify";
import EarnPage from "./pages/earn/earn.page";
import AccountPage from "./pages/account/account-page";
import ExchangePage from "./pages/exchange/exchange.page";

import "./_general.scss";
import {ethers, CreateXOpts, Deployments} from "@interlay/xopts";
import {loadLibAction} from "./common/actions/lib.actions";
import {Signer} from "@interlay/xopts/dist/lib/core";

// eslint-disable-next-line
const detectEthereumProvider = require("@metamask/detect-provider");

const USE_MOCK_LIB = false;

function App(): ReactElement {
    const dispatch = useDispatch();

    useEffect(() => {
        const fireLoading = async () => {
            const web3 = await detectEthereumProvider();
            window.provider = new ethers.providers.Web3Provider(web3);
            const isSigner = window.provider instanceof Signer;

            const addresses = USE_MOCK_LIB ? Deployments.mock : undefined;
            window.xopts = await CreateXOpts(window.provider, addresses);

            dispatch(loadLibAction(true, isSigner, USE_MOCK_LIB));
        };
        fireLoading(); //and forget
    }, [dispatch]);

    return (
        <Router>
            <div className="main d-flex flex-column min-vh-100">
                <ToastContainer></ToastContainer>
                <TopNavigation/>
                <Switch>
                    <Route exact path="/">
                        <LandingPage />
                    </Route>

                    <Route path="/help">
                        <HelpPage />
                    </Route>

                    <Route path="/trade-options/:currency">
                        <TradeOptionsPage />
                    </Route>

                    <Route path="/earn/:tab">
                        <EarnPage></EarnPage>
                    </Route>

                    <Route path="exchange">
                        <ExchangePage></ExchangePage>
                    </Route>

                    <Route path="/account">
                        <AccountPage></AccountPage>
                    </Route>

                </Switch>
                {/* <Footer /> */}
            </div>
        </Router>
    );
}

export default App;

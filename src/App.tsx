import React, { ReactElement, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopNavigation from "./common/components/top-navigation/top-navigation";
import startDataPuller from "./common/utils/data-puller";
import AccountPage from "./pages/account/account-page";
import EarnPage from "./pages/earn/earn.page";
import ExchangePage from "./pages/exchange/exchange.page";
import HelpPage from "./pages/help/help.page";
import LandingPage from "./pages/landing/landing.page";
import PositionsList from "./pages/positions/positions-list.page";
import TradeOptionsPage from "./pages/trade-options/trade-options.page";

import { getProvider, loadLib } from "./common/utils/reloadLib";
import subscribeOnProviderEvents from "./common/utils/subscriber";

import { configureStore } from "./store";
import "./_general.scss";

const store = configureStore();

function App(): ReactElement {
    startDataPuller(store);

    useEffect(() => {
        const fireLoading = async () => {
            await getProvider();
            await loadLib(store);
            subscribeOnProviderEvents(store);
        };
        fireLoading();
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <div className="main d-flex flex-column min-vh-100">
                    <ToastContainer></ToastContainer>
                    <TopNavigation />
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
                            <EarnPage />
                        </Route>

                        <Route path="/exchange">
                            <ExchangePage />
                        </Route>

                        <Route path="/positions">
                            <PositionsList />
                        </Route>

                        <Route path="/account">
                            <AccountPage />
                        </Route>
                    </Switch>
                    {/* <Footer /> */}
                </div>
            </Router>
        </Provider>
    );
}

export default App;

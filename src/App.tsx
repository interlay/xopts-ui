import React, { ReactElement, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TopNavigation from "./common/components/top-navigation/top-navigation";
import HelpPage from "./pages/help/help.page";
import LandingPage from "./pages/landing/landing.page";
import TradeOptionsPage from "./pages/trade-options/trade-options.page";
import { ToastContainer } from "react-toastify";
import EarnPage from "./pages/earn/earn.page";
import AccountPage from "./pages/account/account-page";
import ExchangePage from "./pages/exchange/exchange.page";
import { Provider } from "react-redux";
import { configureStore } from "./store";
import startDataPuller from "./common/utils/data-puller";

import "./_general.scss";
import { getProvider, loadLib } from "./common/utils/reloadLib";
import subscribeOnProviderEvents from "./common/utils/subscriber";

const USE_MOCK_LIB = false;

const store = configureStore();

function App(): ReactElement {
    startDataPuller(store);

    useEffect(() => {
        const fireLoading = async () => {
            await getProvider();
            await loadLib(store, true, USE_MOCK_LIB);
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
        </Provider>
    );
}

export default App;

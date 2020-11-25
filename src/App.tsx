import React, { ReactElement, useEffect } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import TopNavigation from "./common/components/top-navigation/top-navigation";
import startDataPuller from "./common/utils/data-puller";
import { fireLoading } from "./common/utils/reloadLib";
import subscribeOnEvents from "./common/utils/subscriber";
import { USE_MOCK_LIB } from "./config";
import AccountPage from "./pages/account/account-page";
import EarnPage from "./pages/earn/earn.page";
import ExchangePage from "./pages/exchange/exchange.page";
import HelpPage from "./pages/help/help.page";
import LandingPage from "./pages/landing/landing.page";
import PositionsList from "./pages/positions/positions-list.page";
import TradeOptionsPage from "./pages/trade-options/trade-options.page";
import { configureStore } from "./store";
import "./_general.scss";

const store = configureStore();

function App(): ReactElement {
    startDataPuller(store);
    subscribeOnEvents(store);

    useEffect(() => {
        fireLoading(store.dispatch, USE_MOCK_LIB); //and forget
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

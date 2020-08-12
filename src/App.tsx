import React, { ReactElement } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Provider } from "react-redux";
import TopNavigation from "./common/components/top-navigation/top-navigation";
import HelpPage from "./pages/help/help.page";
import LandingPage from "./pages/landing/landing.page";
import TradeOptionsPage from "./pages/trade-options/trade-options.page";
import { configureStore } from "./store";

import "./_general.scss";

const store = configureStore();

function App(): ReactElement {
    return (
        <Provider store={store}>
            <Router>
                <div className="main d-flex flex-column min-vh-100">
                    <TopNavigation/>
                    <Switch>
                            
                        <Route exact path="/">
                            <LandingPage />
                        </Route>

                        <Route path="/help">
                            <HelpPage />
                        </Route>

                        <Route path="/trade-options">
                            <TradeOptionsPage />
                        </Route>

                    </Switch>
                    {/* <Footer /> */}
                </div>
            </Router>
        </Provider>
    );
}

export default App;

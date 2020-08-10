import React, { ReactElement, Suspense } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { applyMiddleware, createStore } from "redux";
import { Provider } from "react-redux";
import { rootReducer } from "./common/reducers/index";
import { createLogger } from "redux-logger";
import "./_general.scss";
import HelpPage from "./pages/help/help.page";
import LandingPage from "./pages/landing/landing.page";
import { loadState, saveState, actionMiddleware } from "./store";

const storeLogger = createLogger();
const store = createStore(rootReducer,loadState(),applyMiddleware(storeLogger,actionMiddleware));
store.subscribe(() => {
    saveState(store.getState());
});

function App(): ReactElement {
    return (
        <Suspense fallback="loading">
            <Provider store={store}>
                <Router>
                    <div className="main d-flex flex-column min-vh-100">
                        {/* <Topbar {...this.state} tryLogIn={this.tryLogIn} /> */}
                        <div className="mb-5">
                            <Switch>
                                <Route path="/">
                                    <LandingPage />
                                </Route>

                                <Route path="/help">
                                    <HelpPage />
                                </Route>

                                {/* {this.state.contracts &&
                <Route path="/positions">
                  <Dashboard 
                    {...this.state}
                    contracts={this.state.contracts}
                    tryLogIn={this.tryLogIn}
                  />
                </Route>
              }

              {this.state.contracts &&
                <Route path="/trade">
                  <Home 
                    {...this.state}
                    contracts={this.state.contracts}
                    tryLogIn={this.tryLogIn}
                  />
                </Route>
              } */}
                            </Switch>
                        </div>
                        {/* <Footer /> */}
                    </div>
                </Router>
            </Provider>
        </Suspense>
    );
}

export default App;

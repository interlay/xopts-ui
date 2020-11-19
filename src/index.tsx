import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./i18n";
import "bootstrap/dist/css/bootstrap.css";
import "react-toastify/dist/ReactToastify.css";
import {Provider} from "react-redux";
import {configureStore} from "./store";
import startDataPuller from "./common/utils/data-puller";
import subscribeOnEvents from "./common/utils/subscriber";
// import * as serviceWorker from './serviceWorker';

const store = configureStore();
startDataPuller(store);
subscribeOnEvents(store);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    </React.StrictMode>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();

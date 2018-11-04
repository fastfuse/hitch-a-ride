import React from "react";
import ReactDOM from "react-dom";
import { Router, Route } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";

import { Provider } from "react-redux";

import App from "./App/App";
import registerServiceWorker from "./registerServiceWorker";
import { store, persistor } from "./_helpers/store";
import history from "./_helpers/history";

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Router history={history}>
                <Route component={App} />
            </Router>
        </PersistGate>
    </Provider>,
    document.getElementById("root")
);

registerServiceWorker();

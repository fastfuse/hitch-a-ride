import storage from "redux-persist/es/storage";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import { applyMiddleware, createStore } from "redux";
import { createFilter } from "redux-persist-transform-filter";
import { persistReducer, persistStore } from "redux-persist";
import { composeWithDevTools } from "redux-devtools-extension";

import rootReducer from "../_reducers";
import authenticationMiddlewares from "../_middlewares/authentication.middlewares";

export const configureStore = () => {
    const persistedFilter = createFilter("authentication", [
        "access",
        "refresh"
    ]);

    const loggerMiddleware = createLogger();
    const reducer = persistReducer(
        {
            key: "hitch-a-ride",
            whitelist: ["authentication"],
            transforms: [persistedFilter],
            storage
        },
        rootReducer
    );

    const store = createStore(
        reducer,
        {},
        composeWithDevTools(
            applyMiddleware(
                authenticationMiddlewares.jwt,
                thunkMiddleware,
                loggerMiddleware
            )
        )
    );
    const persistor = persistStore(store);
    return { store, persistor };
};

export const { store, persistor } = configureStore();

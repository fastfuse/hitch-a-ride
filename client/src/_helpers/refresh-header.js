import {store} from "./store";

export default function refreshHeader() {
    const state = store.getState();
    const auth = state.authentication;

    return auth && auth.refresh
        ? { Authorization: `Bearer ${auth.refresh}` }
        : {};
}

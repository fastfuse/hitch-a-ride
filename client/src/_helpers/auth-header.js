import { store } from "./store";

export default function authHeader() {
    const state = store.getState();
    const auth = state.authentication;
    // return authorization header with jwt token

    return auth && auth.access
        ? { Authorization: `Bearer ${auth.access}` }
        : {};
}

import userConstants from "../_constants/user.constants";
import authenticationConstants from "../_constants/authentication.constants";

const initialState = {
    isLoading: false,
    freshTokenPromise: null,
    access: null,
    refresh: null
};

export default function authentication(state = initialState, action) {
    switch (action.type) {
        case userConstants.LOGIN_REQUEST:
            return {
                ...initialState,
                isLoading: true
            };

        case userConstants.LOGIN_SUCCESS:
            return {
                ...initialState,
                access: action.data.access_token,
                refresh: action.data.refresh_token
            };

        case userConstants.LOGIN_FAILURE:
        case authenticationConstants.JWT_REFRESH_FAILURE:
        case userConstants.LOGOUT_SUCCESS:
            return { ...initialState };

        case authenticationConstants.JWT_REFRESH_REQUEST:
            return { ...state, freshTokenPromise: action.freshTokenPromise };

        case authenticationConstants.JWT_REFRESH_SUCCESS:
            return { ...state, access: action.access_token, freshTokenPromise: null };

        default:
            return state;
    }
}

// Selectors

export const isAuthenticated = state => Boolean(state.access && state.refresh);

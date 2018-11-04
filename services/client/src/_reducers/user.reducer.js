import jwt_decode from "jwt-decode";

import userConstants from "../_constants/user.constants";
import mapConstants from "../_constants/map.constants";

const initialState = {
    isLoading: false
};

export default function user(state = initialState, action) {
    switch (action.type) {
        case userConstants.GET_CURRENT_REQUEST:
            return {
                ...state,
                isLoading: true
            };
        case userConstants.GET_CURRENT_SUCCESS:
            return {
                ...state,
                ...action.data
            };
        case userConstants.GET_CURRENT_FAILURE:
            return {...initialState};

        case "persist/REHYDRATE": {
            if (action.payload) {
                const {authentication} = action.payload;

                if (authentication && authentication.access) {
                    const decoded = jwt_decode(authentication.access);

                    return {
                        ...state,
                        id: decoded.identity,
                        role: decoded.user_claims.role
                    };
                }
            }

            return state;
        }

        case userConstants.LOGIN_SUCCESS: {
            const decoded = jwt_decode(action.data.access_token);

            return {
                ...state,
                id: decoded.identity,
                role: decoded.user_claims.role
            };
        }

        case userConstants.LOGOUT_SUCCESS:
            return {...initialState};

        default:
            return state;
    }
}

// Selectors

export const getFullName = state => `${state.first_name || ""} ${state.last_name || ""}`;
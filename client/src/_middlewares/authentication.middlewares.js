import moment from "moment";
import jwtDecode from "jwt-decode";

import authenticationActions from "../_actions/authentication.actions";
import authenticationConstants from "../_constants/authentication.constants";

function jwt({ dispatch, getState }) {
    return next => action => {
        // only worry about expiring token for async actions
        if (typeof action === "function") {
            const { authentication } = getState();
            if (
                authentication &&
                authentication.refresh &&
                authentication.access
            ) {
                // decode jwt so that we know if and when it expires
                const accessTokenExpiration = jwtDecode(authentication.access)
                    .exp;
                const refreshTokenExpiration = jwtDecode(authentication.refresh)
                    .exp;

                if (
                    accessTokenExpiration &&
                    refreshTokenExpiration &&
                    moment(accessTokenExpiration * 1000) < moment(Date.now()) &&
                    moment(refreshTokenExpiration * 1000) - moment(Date.now()) >
                        5000
                ) {
                    // make sure we are not already refreshing the token
                    if (!authentication.freshTokenPromise)
                        return authenticationActions
                            .refreshToken(dispatch)
                            .then(() => next(action));

                    return authentication.freshTokenPromise.then(() =>
                        next(action)
                    );
                } else if (
                    !accessTokenExpiration ||
                    moment(accessTokenExpiration * 1000) < moment(Date.now())
                )
                    dispatch({
                        type: authenticationConstants.JWT_REFRESH_FAILURE,
                        error: "Refresh token is expired"
                    });
            }
        }
        return next(action);
    };
}

const authenticationMiddlewares = {
    jwt
};

export default authenticationMiddlewares;

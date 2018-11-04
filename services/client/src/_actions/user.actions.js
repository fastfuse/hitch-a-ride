import userConstants from "../_constants/user.constants";
import userService from "../_services/user.service";
import history from "../_helpers/history";


function register(data) {
    function request() {
        return { type: userConstants.REGISTER_REQUEST };
    }

    function success(response) {
        return { type: userConstants.REGISTER_SUCCESS, ...response };
    }

    function failure(response) {
        return { type: userConstants.REGISTER_FAILURE, response };
    }

    return dispatch => {
        dispatch(request());

        return userService.register(data).then(
            response => {
                dispatch(success(response));
                history.push("/");
                return response;
            },
            error => {
                dispatch(failure(error));
                return Promise.reject(error);
            }
        );
    };
}

function login(username, password) {
    function request() {
        return { type: userConstants.LOGIN_REQUEST };
    }

    function success(response) {
        return { type: userConstants.LOGIN_SUCCESS, ...response };
    }

    function failure(response) {
        return { type: userConstants.LOGIN_FAILURE, response };
    }

    return dispatch => {
        dispatch(request({ username }));

        return userService.login(username, password).then(
            response => {
                dispatch(success(response));
                history.push("/");
            },
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

function logout(refreshToken) {
    function request() {
        return { type: userConstants.LOGOUT_REQUEST };
    }

    function success() {
        return { type: userConstants.LOGOUT_SUCCESS };
    }

    function failure() {
        return { type: userConstants.LOGOUT_FAILURE };
    }

    return dispatch => {
        dispatch(request());

        return userService.logout(refreshToken).then(
            () => {
                dispatch(success());
                history.push("/auth");
            },
            () => dispatch(failure())
        );
    };
}

function getCurrent() {
    function request() {
        return { type: userConstants.GET_CURRENT_REQUEST };
    }

    function success(response) {
        return { type: userConstants.GET_CURRENT_SUCCESS, ...response };
    }

    function failure(response) {
        return { type: userConstants.GET_CURRENT_FAILURE, response };
    }

    return dispatch => {
        dispatch(request());

        return userService.getCurrent().then(
            response => dispatch(success(response)),
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

const userActions = {
    login,
    logout,
    register,
    getCurrent
};

export default userActions;

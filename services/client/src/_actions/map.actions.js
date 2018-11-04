import history from "../_helpers/history";
import {store} from "../_helpers/store";
import mapConstants from "../_constants/map.constants";
import mapService from "../_services/map.service";


function createTrip(data) {
    function request() {
        return {type: mapConstants.SELECT_ROUTE_REQUEST};
    }

    function success() {
        return {type: mapConstants.SELECT_ROUTE_SUCCESS};
    }

    function failure(response) {
        return {type: mapConstants.SELECT_ROUTE_FAILURE, response};
    }

    return dispatch => {
        dispatch(request());

        return mapService.createTrip(data).then(
            () => dispatch(success()),
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

function cancelTrip(tripId) {
    function request() {
        return {type: mapConstants.CANCEL_TRIP_REQUEST};
    }

    function success(tripId) {
        return {type: mapConstants.CANCEL_TRIP_SUCCESS, tripId};
    }

    function failure(response) {
        return {type: mapConstants.CANCEL_TRIP_FAILURE, response};
    }

    return dispatch => {
        dispatch(request());

        return mapService.cancelTrip(tripId).then(
            () => dispatch(success(tripId)),
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

function getUserTrips() {
    function request() {
        return {type: mapConstants.GET_USER_TRIPS_REQUEST};
    }

    function success(response) {
        const state = store.getState();
        const {user} = state;

        return {type: mapConstants.GET_USER_TRIPS_SUCCESS, data: {...response.data, user}};
    }

    function failure(response) {
        return {type: mapConstants.GET_USER_TRIPS_FAILURE, response};
    }

    return dispatch => {
        dispatch(request());

        return mapService.getAllTrips().then(
            response => dispatch(success(response)),
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

function getSuggestedTrips() {
    function request() {
        return {type: mapConstants.GET_SUGGESTED_TRIPS_REQUEST};
    }

    function success(response) {
        const state = store.getState();
        const {user} = state;

        return {type: mapConstants.GET_SUGGESTED_TRIPS_SUCCESS, data: {...response.data, user}};
    }

    function failure(response) {
        return {type: mapConstants.GET_SUGGESTED_TRIPS_FAILURE, response};
    }

    return dispatch => {
        dispatch(request());

        return mapService.getAllTrips().then(
            response => dispatch(success(response)),
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

function createRide(data) {
    function request() {
        return {type: mapConstants.CREATE_RIDE_REQUEST};
    }

    function success() {
        return {type: mapConstants.CREATE_RIDE_SUCCESS};
    }

    function failure(response) {
        return {type: mapConstants.CREATE_RIDE_FAILURE, response};
    }

    return dispatch => {
        dispatch(request());

        return mapService.createRide(data).then(
            response => {
                dispatch(success(response));
                history.push('/');
            },
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

function getUserRides() {
    function request() {
        return {type: mapConstants.GET_USER_RIDES_REQUEST};
    }

    function success(response) {
        const state = store.getState();
        const {user} = state;

        return {type: mapConstants.GET_USER_RIDES_SUCCESS, data: {...response.data, user}};
    }

    function failure(response) {
        return {type: mapConstants.GET_USER_RIDES_FAILURE, response};
    }

    return dispatch => {
        dispatch(request());

        return mapService.getAllRides().then(
            response => dispatch(success(response)),
            response => {
                dispatch(failure(response));
                return Promise.reject(response);
            }
        );
    };
}

const mapActions = {
    createTrip,
    getUserTrips,
    getSuggestedTrips,
    createRide,
    getUserRides,
    cancelTrip
};

export default mapActions;

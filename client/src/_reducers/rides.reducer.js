import {combineReducers} from "redux";

import mapConstants from "../_constants/map.constants";
import userConstants from "../_constants/user.constants";


function ids(state = [], action) {
    switch (action.type) {
        case mapConstants.GET_USER_RIDES_SUCCESS:
            return action.data.trips.map(ride => ride.id);

        case userConstants.LOGOUT_SUCCESS:
            return [];

        default:
            return state;
    }
}

function byId(state = {}, action) {
    switch (action.type) {
        case mapConstants.GET_USER_RIDES_SUCCESS: {
            const newState = {...state};
            action.data.trips.forEach(ride => newState[ride.id] = ride);
            return newState;
        }

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

const rides = combineReducers({
    ids,
    byId
});

export default rides;

// Selectors
export const getAllIds = state => state.ids;

export const getAllById = state => ({...state.byId});

export const getAllUserRides = state => {
    const allById = getAllById(state);
    return getAllIds(state).map(id => allById[id]);
};

export const getUserRide = (state, id) => getAllById(state)[id];

export const getUserRideByDriverId = (state, driverId) => {
    const allById = getAllById(state);
    getAllIds(state).forEach(id => {
        if (allById[id].driver_trip.id === driverId) return allById[id];
    });
};

export const getUserRideByHitchhikerId = (state, hitchhikerId) => {
    const allById = getAllById(state);
    getAllIds(state).forEach(id => {
        if (allById[id].hitchhiker_trip.id === hitchhikerId) return allById[id];
    });
};

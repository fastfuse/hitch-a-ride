import {combineReducers} from "redux";

import mapConstants from "../_constants/map.constants";
import userConstants from "../_constants/user.constants";


function ids(state = [], action) {
    switch (action.type) {
        case mapConstants.GET_SUGGESTED_TRIPS_SUCCESS: {
            const {trips, user} = action.data;

            return trips.filter(trip => trip.user_id !== user.id && trip.status === 'Scheduled').map(trip => trip.id);
        }

        case userConstants.LOGOUT_SUCCESS:
            return [];

        default:
            return state;
    }
}

function byId(state = {}, action) {
    switch (action.type) {
        case mapConstants.GET_SUGGESTED_TRIPS_SUCCESS: {
            const newState = {...state};
            const {trips, user} = action.data;

            trips.filter(trip => trip.user_id !== user.id && trip.status === 'Scheduled').forEach(trip => newState[trip.id] = trip);
            return newState;
        }

        case userConstants.LOGOUT_SUCCESS:
            return {};

        default:
            return state;
    }
}

const suggestedTrips = combineReducers({
    ids,
    byId
});

export default suggestedTrips;

// Selectors
export const getSuggestedTrips = state => state.ids.map(id => state.byId[id]);

export const getSuggestedTrip = (state, id) => state.byId[id];

export const getSuggestedTripsById = (state) => ({...state.byId});
import axios from "axios";

import authHeader from "../_helpers/auth-header";
import {handleResponse} from '../_helpers/utils';

const createTrip = data =>
    axios.post(`${process.env.REACT_APP_URL}/api/v1/trips`, data, {headers: authHeader()}).then(handleResponse);

const cancelTrip = tripId =>
    axios.delete(`${process.env.REACT_APP_URL}/api/v1/trips/${tripId}`, {headers: authHeader()}).then(handleResponse);

const getAllTrips = () =>
    axios.get(`${process.env.REACT_APP_URL}/api/v1/trips`, {headers: authHeader()}).then(handleResponse);

const createRide = data =>
    axios.post(`${process.env.REACT_APP_URL}/api/v1/rides`, data, {headers: authHeader()}).then(handleResponse);

const getAllRides = () =>
    axios.get(`${process.env.REACT_APP_URL}/api/v1/rides`, {headers: authHeader()}).then(handleResponse);

const mapService = {
    createTrip,
    getAllTrips,
    createRide,
    getAllRides,
    cancelTrip
};

export default mapService;

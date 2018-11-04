import axios from "axios";

import refreshHeader from "../_helpers/refresh-header";

const handleResponse = response =>
    response.status === 200
        ? response.data
        : Promise.reject(response.statusText);

const refreshJWT = () =>
    axios.get(`${process.env.REACT_APP_URL}/auth/refresh`, {headers: refreshHeader()}).then(handleResponse);

const authenticationService = {
    refreshJWT
};

export default authenticationService;

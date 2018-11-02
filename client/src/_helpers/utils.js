export const handleResponse = response => {
    if ([200, 201, 202].includes(response.status))
        return response;

    if (response.status === 500)
        return Promise.reject({data: {message: "Unexpected error occurred"}});

    return Promise.reject(response);
};

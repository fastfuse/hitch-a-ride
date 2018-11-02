import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Route, Redirect } from "react-router-dom";

const GuestRoute = ({ isAuthenticated, component: Component, ...rest }) => (
    <Route
        {...rest}
        render={props =>
            !isAuthenticated ? <Component {...props} /> : <Redirect to="/" />
        }
    />
);

GuestRoute.propTypes = {
    component: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
    const { authentication } = state;
    return {
        isAuthenticated: Boolean(
            authentication.access && authentication.refresh
        )
    };
}

export default connect(mapStateToProps)(GuestRoute);

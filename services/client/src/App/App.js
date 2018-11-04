import PropTypes from "prop-types";
import React from "react";
import {connect} from "react-redux";

import Snackbar from "@material-ui/core/Snackbar/Snackbar";

import GuestRoute from '../_components/routes/GuestRoute';
import PrivateRoute from '../_components/routes/PrivateRoute';

import HomePage from "../HomePage/HomePage";
import AuthPage from "../AuthPage/AuthPage";
import TripDetailsPage from "../TripDetailsPage/TripDetailsPage";

import ProfilePage from "../ProfilePage/ProfilePage";
import userActions from "../_actions/user.actions";

import {isAuthenticated, getSnackContent} from "../_reducers";
import SnackBarContent from "../_components/messages/SnackBarContent";
import projectActions from "../_actions/project.actions";



class App extends React.Component {
    componentDidMount() {
        const {isAuthenticated, getCurrentUser} = this.props;

        if(isAuthenticated)
            getCurrentUser();
    }

    componentDidUpdate(prevProps) {
        const {isAuthenticated, getCurrentUser} = this.props;

        if(isAuthenticated && isAuthenticated !== prevProps.isAuthenticated)
            getCurrentUser();
    }

    render() {
        const {location, snackBar, hideSnackBar} = this.props;

        return (
            <div className="container">
                <PrivateRoute location={location} exact path="/trips/add" component={HomePage}/>
                <PrivateRoute location={location} exact path="/trips/:id(\d+)" component={TripDetailsPage}/>
                <PrivateRoute location={location} exact path="/" component={ProfilePage}/>
                <GuestRoute location={location} exact path="/auth" component={AuthPage}/>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    open={snackBar.openSnackBar}
                    autoHideDuration={4000}
                    onClose={hideSnackBar}
                >
                    <SnackBarContent
                        onClose={hideSnackBar}
                        variant={snackBar.snackVariant}
                        message={snackBar.snackMessage}
                    />
                </Snackbar>
            </div>
        );
    }
}

App.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired
};

const mapStateToProps = state => ({
    isAuthenticated: isAuthenticated(state),
    snackBar: getSnackContent(state)
});

export default connect(mapStateToProps, {
    getCurrentUser: userActions.getCurrent,
    hideSnackBar: projectActions.hideSnackBar
})(App);

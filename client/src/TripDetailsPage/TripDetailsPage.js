import React from "react";
import {connect} from "react-redux";
import moment from "moment";
import {DirectionsRenderer, Marker, Polyline, MarkerWithLabel} from "react-google-maps";

import {withStyles} from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid/Grid";
import Hidden from '@material-ui/core/Hidden';
import Button from "@material-ui/core/Button/Button";
import Typography from "@material-ui/core/Typography/Typography";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import {getUserTrip, getSuggestedTrips, getSuggestedTripsById} from "../_reducers";
import mapActions from "../_actions/map.actions";
import Header from "../_components/general/Header";
import TripCard from "../_components/map/TripCard";
import MapComponent from "../_components/map/MapComponent";
import MarkerA from "../static/img/marker-a.svg";
import MarkerB from "../static/img/marker-b.svg";
import {createRide} from '../_actions/map.actions';
import projectActions from "../_actions/project.actions";


const styles = {
    root: {
        height: "100vh"
    },
    page: {
        maxWidth: 1700,
        margin: "0 auto",
        paddingTop: 24,
        width: "100%"
    },
    scrollableParent: {
        height: "90vh",
        overflow: "hidden",
        paddingLeft: 4
    },
    scrollable: {
        height: "100%",
        overflow: "scroll",
        marginRight: -50,
        paddingRight: 50,
        paddingLeft: 4,
        overflowY: "scroll"
    },
    button: {
        color: "#fff",
        background: "#DF691A",
        "&:hover": {
            background: "#DF691A",
            opacity: 0.9
        }
    },
    showSuggestedTripsButton: {
        border: "1px solid #DF691A",
        color: "#DF691A"
    },
    closeDialogButton: {
        color: "#DF691A"
    },
    title: {
        margin: "0 0 24px"
    },
    scrollableContent: {
        paddingBottom: 50,
    }
};

class TripDetailsPage extends React.Component {
    state = {
        selectedTrip: null,
        showSuggestedTrips: false
    };

    handleTripSelect = id => this.setState({selectedTrip: id});

    componentDidMount() {
        this.props.getUserTrips();
        this.props.getSuggestedTrips();
    }

    createRide = () => {
        const {selectedTrip} = this.state;
        const {trip, createRide, showSnackBar} = this.props;

        createRide({
            hitchhiker_trip_id: selectedTrip,
            driver_trip_id: trip.id
        }).then(() => showSnackBar({
            snackVariant: "success",
            snackMessage: "Trip successfully canceled",
        })).catch(error => showSnackBar({
            snackVariant: "error",
            snackMessage: error.response.data.message,
        }));
        ;
    };

    handleTripDialogClose = () => this.setState({showSuggestedTrips: false});

    render() {
        const {selectedTrip, showSuggestedTrips} = this.state;
        const {trip, suggestedTrips, classes, suggestedTripsById} = this.props;

        const route = trip && JSON.parse(trip.route);
        const date = trip && moment.unix(trip.departure).format("DD/MM/YYYY");
        const time = trip && moment.unix(trip.departure).format("HH:mm a");

        let mapChildren = [];

        if (selectedTrip !== null) {
            const trip = suggestedTripsById[selectedTrip];
            const route = trip && JSON.parse(trip.route);

            mapChildren.push(
                <React.Fragment>
                    <Marker
                        position={{
                            lat: route.request.origin.location.lat,
                            lng: route.request.origin.location.lng
                        }}
                        options={{icon: MarkerA}}
                    />
                    <Marker
                        position={{
                            lat: route.request.destination.location.lat,
                            lng: route.request.destination.location.lng
                        }}
                        options={{icon: MarkerB}}
                    />
                    <Polyline
                        path={route.routes[0].overview_path}
                        key="selected-route"
                        geodesic={true}
                        options={{
                            strokeColor: "red",
                            strokeOpacity: 0.8,
                            strokeWeight: 5,
                            clickable: true
                        }}
                    />
                </React.Fragment>
            );
        }

        if (route) {
            for (let i = 0; i < route.routes.length; i++) {
                mapChildren.push(
                    <DirectionsRenderer
                        key={i}
                        directions={route}
                        routeIndex={i}
                    />
                );
            }
        }

        const reviewCardComponent = (
            <Grid item xs={12} md={4} container justify="center">
                <Grid item xs={12}>
                    <Typography variant="title" className={classes.title}>
                        Your trip
                    </Typography>
                </Grid>
                {trip && <Grid item><TripCard route={route} date={date} time={time}/></Grid>}
            </Grid>
        );

        const suggestedTripsComponent = (
            <Grid item xs={12} md={4} container className={classes.scrollableParent}>
                <Grid item>
                    <Typography variant="title" className={classes.title}>
                        Suggested trips
                    </Typography>
                </Grid>
                <Grid item className={classes.scrollable}>
                    <Grid container spacing={24} className={classes.scrollableContent}>
                        {
                            suggestedTrips.map(trip => {
                                const route = trip && JSON.parse(trip.route);
                                const date = trip && moment.unix(trip.departure).format("DD/MM/YYYY");
                                const time = trip && moment.unix(trip.departure).format("HH:mm a");

                                return (
                                    <Grid item xs={12} key={trip.id} className={classes.selectedRoute}>
                                        <TripCard
                                            route={route}
                                            date={date}
                                            time={time}
                                            handleTripSelect={() => this.handleTripSelect(trip.id)}
                                            selected={trip.id === selectedTrip}
                                            selectable
                                        />
                                    </Grid>
                                );
                            })
                        }
                    </Grid>
                </Grid>
            </Grid>
        );

        const mapComponent = (
            <Grid item xs={12} md={4} container spacing={24}>
                <Grid item xs={12}>
                    <Typography variant="title">
                        Result Ride
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <MapComponent
                        loadingElement={<div style={{height: `100%`}}/>}
                        containerElement={<div style={{height: `500px`, width: "100%"}}/>}
                        mapElement={<div style={{height: `100%`}}/>}
                    >
                        {mapChildren}
                    </MapComponent>
                </Grid>
                <Grid item xs={12} style={{textAlign: "right"}}>
                    <Hidden mdUp>
                        <Button
                            variant="outlined"
                            className={classes.showSuggestedTripsButton}
                            style={{marginRight: 12}}
                            onClick={() => this.setState({showSuggestedTrips: true})}
                        >
                            Show suggested trips
                        </Button>
                    </Hidden>
                    <Button
                        variant="contained"
                        className={classes.button}
                        disabled={selectedTrip === null}
                        onClick={this.createRide}
                    >
                        Create Ride
                    </Button>
                </Grid>
            </Grid>
        );

        return (
            <div className={classes.root}>
                <Header/>
                <Grid container className={classes.page} alignItems="flex-start" spacing={16}>
                    <Hidden smDown>
                        {reviewCardComponent}
                        {suggestedTripsComponent}
                        {mapComponent}
                    </Hidden>
                    <Hidden mdUp>
                        {reviewCardComponent}

                        {mapComponent}
                        <Dialog
                            open={this.state.showSuggestedTrips}
                            onClose={this.handleTripDialogClose}
                            scroll="paper"
                            aria-labelledby="scroll-dialog-title"
                        >
                            <DialogTitle id="scroll-dialog-title">Suggested trips</DialogTitle>
                            <DialogContent>
                                <DialogContentText>
                                    <Grid container spacing={16}>
                                        {
                                            suggestedTrips.map(trip => {
                                                const route = trip && JSON.parse(trip.route);
                                                const date = trip && moment.unix(trip.departure).format("DD/MM/YYYY");
                                                const time = trip && moment.unix(trip.departure).format("HH:mm a");

                                                return (
                                                    <Grid item xs={12} key={trip.id} className={classes.selectedRoute}>
                                                        <TripCard
                                                            route={route}
                                                            date={date}
                                                            time={time}
                                                            handleTripSelect={() => this.handleTripSelect(trip.id)}
                                                            selected={trip.id === selectedTrip}
                                                            selectable
                                                        />
                                                    </Grid>
                                                );
                                            })
                                        }
                                    </Grid>
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleTripDialogClose} className={classes.closeDialogButton}>
                                    Close
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Hidden>
                </Grid>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    trip: getUserTrip(state, props.match.params.id),
    suggestedTrips: getSuggestedTrips(state),
    suggestedTripsById: getSuggestedTripsById(state)
});

export default connect(mapStateToProps, {
    getSuggestedTrips: mapActions.getSuggestedTrips,
    getUserTrips: mapActions.getUserTrips,
    createRide: mapActions.createRide,
    showSnackBar: projectActions.showSnackBar
})(withStyles(styles)(TripDetailsPage));

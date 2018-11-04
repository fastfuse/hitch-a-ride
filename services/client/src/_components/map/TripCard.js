import React from "react";
import {connect} from "react-redux";

import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card/Card";
import CardActionArea from "@material-ui/core/CardActionArea/CardActionArea";
import CardContent from "@material-ui/core/CardContent/CardContent";
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Today from "@material-ui/icons/Today";
import AccessTime from '@material-ui/icons/AccessTime';
import IconButton from '@material-ui/core/IconButton';
import Close from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

import MarkerA from "../../static/img/marker-a.svg";
import MarkerB from "../../static/img/marker-b.svg";
import {Marker, Path, StaticGoogleMap} from "react-static-google-map";
import history from "../../_helpers/history";
import mapActions from "../../_actions/map.actions";
import projectActions from "../../_actions/project.actions";

const styles = {
    card: {
        maxWidth: 450,
        position: "relative",
        margin: "0 auto"
    },
    selectedCard: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        background: "rgba(223, 105, 26, 0.3)"
    },
    cardWrapper: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        background: "rgba(255, 255, 255, 0)"
    },
    cancelButton: {
        position: "absolute",
        top: 4,
        right: 4,
        zIndex: 2
    },
    dialogCancelButton: {
        color: "rgba(0, 0, 0, 0.5)"
    },
    staticMaps: {
        width: "100%"
    }
};

let StaticMap = props => {
    const {route, classes} = props;
    return (
        <StaticGoogleMap size="450x345" apiKey="AIzaSyC7ZXOS5Bpp8MHRH98KJ6NPP9W-x0S3Zrk" className={classes.staticMaps}>
            <Marker
                location={{
                    lat: route.request.origin.location.lat,
                    lng: route.request.origin.location.lng
                }}
                label="A"
            />
            <Marker
                location={{
                    lat: route.request.destination.location.lat,
                    lng: route.request.destination.location.lng
                }}
                label="B"
            />
            <Path
                color="0xff0000ff"
                weight="5"
                points={route.routes[0].overview_path}
            />
        </StaticGoogleMap>
    );
};

StaticMap = withStyles(styles)(StaticMap);

class TripCard extends React.Component {
    state = {
        openConfirm: false
    };

    cancelClick = tripId => {
        const {showSnackBar} = this.props;

        this.handleConfirmStatus(false)();
        this.props.cancelTrip(tripId).then(() => showSnackBar({
            snackVariant: "success",
            snackMessage: "Trip successfully canceled",
        })).catch(error => showSnackBar({
            snackVariant: "error",
            snackMessage: error.response.data.message,
        }));
    };

    handleConfirmStatus = status => () => {
        this.setState({openConfirm: status});
    };

    render() {
        const {openConfirm} = this.state;
        const {route, date, time, classes, selected, selectable, trip, redirectTo, handleTripSelect} = this.props;

        let cardActionArea = (
            <React.Fragment>
                <StaticMap route={route}/>
                <CardContent>
                    <Grid container spacing={24}>
                        <Grid item container spacing={40}>
                            <Grid item xs={1}>
                                <img src={MarkerA} alt="Marker A"/>
                            </Grid>
                            <Grid item xs>
                                <Typography component="p">
                                    {route.routes[0].legs[0].start_address}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={40}>
                            <Grid item xs={1}>
                                <img src={MarkerB} alt="Marker A"/>
                            </Grid>
                            <Grid item xs>
                                <Typography component="p">
                                    {route.routes[0].legs[0].end_address}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={40}>
                            <Grid item xs={1}>
                                <Today/>
                            </Grid>
                            <Grid item xs>
                                <Typography component="p">
                                    {date}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Grid item container spacing={40}>
                            <Grid item xs={1}>
                                <AccessTime/>
                            </Grid>
                            <Grid item xs>
                                <Typography component="p">
                                    {time}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </React.Fragment>
        );

        if (redirectTo)
            cardActionArea = (
                <CardActionArea onClick={() => history.push(redirectTo)}>
                    {cardActionArea}
                </CardActionArea>
            );
        else if (selectable)
            cardActionArea = (
                <CardActionArea onClick={() => handleTripSelect()}>
                    {cardActionArea}
                </CardActionArea>
            );

        return (
            <Card className={classes.card}>
                {selected && <div className={classes.selectedCard}/>}
                {!redirectTo && !selectable && <div className={classes.cardWrapper}/>}
                {trip && trip.status === "Scheduled" && (
                    <IconButton aria-label="Delete" className={classes.cancelButton}
                                onClick={this.handleConfirmStatus(true)}>
                        <Close fontSize="small"/>
                    </IconButton>
                )}
                {cardActionArea}
                <Dialog
                    open={openConfirm}
                    onClose={this.handleConfirmStatus(false)}
                >
                    <DialogTitle>Cancel trip</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="confirm-dialog-content">
                            Are you sure you want to cancel trip?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleConfirmStatus(false)} variant="outlined"
                                className={classes.dialogCancelButton} autoFocus>
                            Cancel
                        </Button>
                        <Button onClick={() => this.cancelClick(trip.id)} variant="contained" color="secondary">
                            Cancel trip
                        </Button>
                    </DialogActions>
                </Dialog>
            </Card>
        )
    }
}

export default connect(null, {
    cancelTrip: mapActions.cancelTrip,
    showSnackBar: projectActions.showSnackBar
})(withStyles(styles)(TripCard));

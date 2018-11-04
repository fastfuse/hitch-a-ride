import React from "react";

import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card/Card";
import Divider from '@material-ui/core/Divider';
import Grid from "@material-ui/core/Grid/Grid";
import Typography from "@material-ui/core/Typography/Typography";
import Today from "@material-ui/icons/Today";
import AccessTime from '@material-ui/icons/AccessTime';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import MarkerA from "../../static/img/marker-a.svg";
import MarkerB from "../../static/img/marker-b.svg";
import GreenMarkerA from "../../static/img/green-marker-a.png";
import GreenMarkerB from "../../static/img/green-marker-b.png";

import {Marker, Path, StaticGoogleMap} from "react-static-google-map";
import moment from "moment";

const styles = {
    card: {
        width: "100%",
        maxWidth: 450,
        margin: "0 auto",
        position: "relative"
    },
    staticMap: {
        "& img": {
            display: "block"
        }
    },
    cardWrapper: {
        position: "absolute",
        height: "100%",
        width: "100%",
        zIndex: 1,
        background: "rgba(255, 255, 255, 0)"
    },
    staticMaps: {
        width: "100%"
    }
};

let StaticMap = props => {
    const {route, optedRoute, classes} = props;
    return (
        <StaticGoogleMap size="450x380" apiKey="AIzaSyC7ZXOS5Bpp8MHRH98KJ6NPP9W-x0S3Zrk" className={classes.staticMaps}>

            <Marker
                location={{
                    lat: route.request.origin.location.lat,
                    lng: route.request.origin.location.lng
                }}
                color="0x01c73888"
                label="A"
            />
            <Marker
                location={{
                    lat: route.request.destination.location.lat,
                    lng: route.request.destination.location.lng
                }}
                color="0x01c73888"
                label="B"
            />
            <Path
                color="0x01c738aa"
                weight="5"
                points={route.routes[0].overview_path}
            />

            {optedRoute && <Marker
                location={{
                    lat: optedRoute.request.origin.location.lat,
                    lng: optedRoute.request.origin.location.lng
                }}
                color="0xff000088"
                label="A"
            />}
            {optedRoute && <Marker
                location={{
                    lat: optedRoute.request.destination.location.lat,
                    lng: optedRoute.request.destination.location.lng
                }}
                color="0xff000088"
                label="B"
            />}
            {optedRoute && <Path
                color="0xff000088"
                weight="5"
                points={optedRoute.routes[0].overview_path}
            />}
        </StaticGoogleMap>
    );
};

StaticMap = withStyles(styles)(StaticMap);

const ShrinkedOptedTripCard = props => {
    const {driverTrip, hitchhikerTrip, classes} = props;

    const driverRoute = driverTrip.route && JSON.parse(driverTrip.route);
    const driverDate = driverTrip.departure && moment.unix(driverTrip.departure).format("DD/MM/YYYY");
    const driverTime = driverTrip.departure && moment.unix(driverTrip.departure).format("HH:mm a");

    const hitchhikerRoute = hitchhikerTrip.route && JSON.parse(hitchhikerTrip.route);
    const hitchhikerDate = hitchhikerTrip.departure && moment.unix(hitchhikerTrip.departure).format("DD/MM/YYYY");
    const hitchhikerTime = hitchhikerTrip.departure && moment.unix(hitchhikerTrip.departure).format("HH:mm a");


    return (
        <Card className={classes.card}>
            <div className={classes.cardWrapper}/>

            <Grid container direction="column">
                <Grid item className={classes.staticMap}>
                    <StaticMap
                        route={driverRoute}
                        optedRoute={hitchhikerRoute}
                    />
                </Grid>
                <Grid item xs>
                    <List>
                        <ListItem>
                            <Grid item container>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <img src={GreenMarkerA} alt="Marker A"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {driverRoute.routes[0].legs[0].start_address}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <img src={GreenMarkerB} alt="Marker B"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {driverRoute.routes[0].legs[0].end_address}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <Today/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {driverDate}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <AccessTime/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {driverTime}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItem>
                        <li>
                            <Divider inset/>
                        </li>
                        <ListItem>
                            <Grid item container>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <img src={MarkerA} alt="Marker A"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {hitchhikerRoute.routes[0].legs[0].start_address}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <img src={MarkerB} alt="Marker A"/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {hitchhikerRoute.routes[0].legs[0].end_address}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <Today/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {hitchhikerDate}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item container spacing={40}>
                                    <Grid item xs={1}>
                                        <AccessTime/>
                                    </Grid>
                                    <Grid item xs>
                                        <Typography component="p">
                                            {hitchhikerTime}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>

        </Card>
    )
};

export default withStyles(styles)(ShrinkedOptedTripCard);

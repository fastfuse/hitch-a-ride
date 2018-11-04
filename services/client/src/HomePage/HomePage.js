import React from "react";
import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core/styles';
import moment from 'moment';

import Autocomplete from 'react-google-autocomplete';
import Grid from '@material-ui/core/Grid';
import CardContent from "@material-ui/core/CardContent/CardContent";
import Card from "@material-ui/core/Card/Card";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button/Button";
import Hidden from '@material-ui/core/Hidden';

import Header from '../_components/general/Header';
import MapComponent from "../_components/map/MapComponent";
import mapActions from '../_actions/map.actions';
import {DirectionsRenderer, Marker, Polyline} from "react-google-maps";
import projectActions from "../_actions/project.actions";


const styles = {
    inputLabel: {
        fontSize: 18,
    },
    input: {
        borderRadius: 4,
        backgroundColor: "#fff",
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '8px 12px',
        margin: "24px 0 12px",
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(',')
    },
    mapCard: {
        maxWidth: 1500,
        width: "100%"
    },
    contentColumns: {
        display: "flex"
    },
    leftColumn: {
        width: "100%",
        display: "flex",
        flexDirection: "column"
    },
    rightColumn: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    routeCard: {
        margin: "12px 0",
        maxWidth: 800,
        width: "100%",
        display: 'flex',
    },
    routeMap: {
        width: "100%",

    },
    routeCardDetails: {
        minWidth: 300
    },
    inputCard: {
        margin: "24px auto"
    },
    formControl: {
        width: "100%"
    },
    root: {
        maxWidth: 1600,
        margin: "0 auto",
        padding: "24px"
    },
    alternativeCard: {
        "&:hover": {
            cursor: "pointer",
            background: "rgba(0, 0, 0, .05)",
        }
    },
    button: {
        color: "#fff",
        background: "#DF691A",
        "&:hover": {
            background: "#DF691A",
            opacity: 0.9
        }
    },
};

class HomePage extends React.Component {
    state = {
        from: null,
        to: null,
        date: moment().format('YYYY-MM-DD'),
        time: moment().format('HH:mm'),
        selectedRoute: null,
        directions: null
    };

    createTrip = () => {
        const {directions, date, time, selectedRoute} = this.state;
        const {showSnackBar} = this.props;

        if (directions && date && time && selectedRoute !== null) {
            const route = {...directions, routes: [directions.routes[selectedRoute]]};
            const data = {
                route: JSON.stringify(route),
                departure: moment(`${date} ${time}`, "YYYY-MM-DD HH:mm").valueOf() / 1000
            };

            this.props.createTrip(data).then(() => this.props.history.push({
                pathname: "/",
                state: {
                    selectedType: "Scheduled"
                }
            })).then(() => showSnackBar({
                snackVariant: "success",
                snackMessage: "Trip successfully created",
            }));
        }
    };

    handleInput = position => place => {
        this.setState({
            [position]: place
        });
    };

    handleChange = key => value => this.setState({[key]: value});

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {from, to,} = this.state;

        const DirectionsService = new window.google.maps.DirectionsService();

        if (from && to && (from !== prevState.from || to !== prevState.to)) {
            DirectionsService.route({
                origin: new window.google.maps.LatLng(from.geometry.location.lat(), from.geometry.location.lng()),
                destination: new window.google.maps.LatLng(to.geometry.location.lat(), to.geometry.location.lng()),
                travelMode: window.google.maps.TravelMode.DRIVING,
                provideRouteAlternatives: true
            }, (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK)
                    this.setState({directions: result});
                else
                    this.setState({directions: null});
            });
            this.setState({directions: null});
        }
    }

    render() {
        const {classes} = this.props;
        const {from, to, directions, date, time, selectedRoute} = this.state;

        let directionsArray = [];
        if (directions && selectedRoute !== null)
            directionsArray.push(
                <Polyline
                    path={directions.routes[selectedRoute].overview_path}
                    key="selected-route"
                    geodesic={true}
                    options={{
                        strokeColor: "#01579B",
                        strokeOpacity: 0.8,
                        strokeWeight: 5,
                        clickable: true
                    }}
                />
            );
        else if (directions)
            for (let i = 0; i < directions.routes.length; i++)
                if (i !== selectedRoute)
                    directionsArray.push(
                        <DirectionsRenderer
                            key={i}
                            directions={directions}
                            routeIndex={i}
                        />
                    );

        const formComponent = (

            <Grid container spacing={32}>
                <Grid item xs={12} md={11}>
                    <Typography variant="headline" gutterBottom>
                        Your trip
                    </Typography>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="from-point"
                                                    className={classes.inputLabel}>
                                            From
                                        </InputLabel>
                                        <Autocomplete
                                            id="from-point"
                                            placeholder=""
                                            className={classes.input}
                                            onPlaceSelected={this.handleInput("from")}
                                            types={['address']}
                                            componentRestrictions={{country: "ua"}}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="to-point"
                                                    className={classes.inputLabel}>
                                            To
                                        </InputLabel>
                                        <Autocomplete
                                            id="to-point"
                                            placeholder=""
                                            className={classes.input}
                                            onPlaceSelected={this.handleInput("to")}
                                            types={['address']}
                                            componentRestrictions={{country: "ua"}}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="date" className={classes.inputLabel}>
                                            Date
                                        </InputLabel>
                                        <TextField
                                            id="date"
                                            type="date"
                                            onChange={e => this.handleChange('date')(e.target.value)}
                                            value={date}
                                            className={classes.input}
                                            InputProps={{disableUnderline: true}}
                                        />
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl className={classes.formControl}>
                                        <InputLabel shrink htmlFor="time" className={classes.inputLabel}>
                                            Time
                                        </InputLabel>
                                        <TextField
                                            id="time"
                                            type="time"
                                            value={time}
                                            onChange={e => this.handleChange('time')(e.target.value)}
                                            className={classes.input}
                                            InputProps={{
                                                disableUnderline: true
                                            }}
                                            inputProps={{
                                                step: 300 // 5 min
                                            }}
                                        />
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                {directions && (
                    <Grid item xs={11} container direction="column" spacing={16}>
                        <Grid item>
                            <Typography variant="headline">
                                Routes
                            </Typography>
                        </Grid>
                        {
                            directions.routes.map((route, index) => (
                                <Grid item key={index}>
                                    <Card
                                        className={classes.alternativeCard}
                                        style={{background: selectedRoute === index && "#80D8FF"}}
                                        onClick={() => this.handleChange('selectedRoute')(index)}
                                    >
                                        <CardContent>{route.summary}</CardContent>
                                    </Card>
                                </Grid>
                            ))
                        }
                    </Grid>
                )}
                <Grid item xs={11}>
                    <Button
                        variant="contained"
                        className={classes.button}
                        disabled={!date || !time || selectedRoute === null}
                        onClick={this.createTrip}
                    >
                        Create Trip
                    </Button>
                </Grid>
            </Grid>

        );

        const cardComponent = (
            <Card className={classes.mapCard}>
                <MapComponent
                    loadingElement={<div style={{height: `100%`}}/>}
                    containerElement={<div style={{height: `700px`}}/>}
                    mapElement={<div style={{height: `100%`}}/>}
                >
                    {from && <Marker
                        position={{lat: from.geometry.location.lat(), lng: from.geometry.location.lng()}}/>}
                    {to &&
                    <Marker position={{lat: to.geometry.location.lat(), lng: to.geometry.location.lng()}}/>}
                    {directionsArray}
                </MapComponent>
            </Card>
        );

        return (
            <div>
                <Header/>
                <Grid container className={classes.root}>
                    <Hidden smDown>
                        <Grid item md={4}>
                            {formComponent}
                        </Grid>
                        <Grid item md={8}>
                            {cardComponent}
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid item xs={12}>
                            {cardComponent}
                        </Grid>
                        <Grid item xs={12} style={{marginTop: 12}}>
                            {formComponent}
                        </Grid>
                    </Hidden>
                </Grid>
            </div>
        )
    }
}

export default connect(null, {
    createTrip: mapActions.createTrip,
    showSnackBar: projectActions.showSnackBar
})(withStyles(styles)(HomePage));

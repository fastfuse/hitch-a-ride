import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Hidden from '@material-ui/core/Hidden';

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import userActions from "../_actions/user.actions";
import projectActions from "../_actions/project.actions";

const styles = {
    page: {
        background: "#2B3E50",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "start"
    },
    card: {
        maxWidth: 1100,
        width: "100%",
        background: "#4E5D6C",
        textAlign: "center",
        padding: 24,
        margin: 24,
        marginTop: "5%",
    },
    button: {
        color: "#5cb85c",
        border: "1px solid #5cb85c",
        margin: 12
    },
    text: {
        color: "#ebebeb",
        fontFamily: "Lato",
        fontWeight: 100
    },
    dialog: {
        alignItems: "start"
    }
};


class AuthPage extends React.Component {
    state = {
        loginDialog: false,
        registerDialog: false,
        tab: 0,
        login: {
            email: "",
            password: ""
        },
        hitchhiker: {
            firstName: "",
            lastName: "",
            emailHitchhiker: "",
            passwordHitchhiker: ""
        },
        driver: {
            firstName: "",
            lastName: "",
            emailDriver: "",
            passwordDriver: "",
            vehicleName: "",
            vehicleId: ""
        },
    };

    handleLogin = () => {
        const {login: {email, password}} = this.state;
        const {showSnackBar} = this.props;
        this.props.login(email, password).catch(error => {
            let snackMessage;
            try {
                snackMessage = error.response.data.messag;
            } catch (e) {
                snackMessage = 'Unknown error';
            }
            showSnackBar({
                snackVariant: "error",
                snackMessage: snackMessage,
            })
        })
    };


    handleRegister = () => {
        const {hitchhiker, driver, tab} = this.state;
        const {showSnackBar} = this.props;

        let data = null;

        if (tab === 0)
            data = {
                first_name: hitchhiker.firstName,
                last_name: hitchhiker.lastName,
                email: hitchhiker.emailHitchhiker,
                password: hitchhiker.passwordHitchhiker,
                role: "Hitchhiker"
            };
        else
            data = {
                first_name: driver.firstName,
                last_name: driver.lastName,
                email: driver.emailDriver,
                password: driver.passwordDriver,
                vehicle_name: driver.vehicleName,
                vehicle_id: driver.vehicleId,
                role: "Driver"
            };

        this.props.register(data).then(response => showSnackBar({
            snackVariant: response.status === 200 ? "success" : "info",
            snackMessage: response.data.message,
        })).catch(error => {
            console.log(error);
            return showSnackBar({
                snackVariant: "error",
                snackMessage: error.response.data.message,
            })
        });
    };

    handleOpen = name => () => {
        this.setState({[name]: true});
    };

    handleClose = name => () => {
        this.setState({[name]: false});
    };

    handleTabChange = (event, tab) => {
        this.setState({tab});
    };

    handleChange = type => name => event => {
        event.persist();
        this.setState(prevState => ({
            [type]: {
                ...prevState[type],
                [name]: event.target.value
            }
        }));
    };

    render() {
        const {classes} = this.props;
        const {
            login, loginDialog, registerDialog, tab, hitchhiker, driver
        } = this.state;

        return (
            <div className={classes.page}>
                <Card className={classes.card}>
                    <CardContent>
                        <Hidden xsDown>
                            <Typography variant="display3" gutterBottom className={classes.text}>
                                Welcome to Hitch A Ride!
                            </Typography>
                        </Hidden>
                        <Hidden smUp>
                            <Typography variant="headline" gutterBottom className={classes.text}>
                                Welcome to Hitch A Ride!
                            </Typography>
                        </Hidden>
                        <Typography variant="title" gutterBottom className={classes.text}>
                            This is a simple app to help people find a ride in Lviv.
                        </Typography>
                        <Typography variant="subheading" gutterBottom className={classes.text}>
                            To get a ride please
                            <Hidden smUp>
                                <br/>
                            </Hidden>
                            <Button variant="outlined" className={classes.button}
                                    onClick={this.handleOpen('loginDialog')}>
                                Login
                            </Button> or
                            <Button variant="outlined" className={classes.button}
                                    onClick={this.handleOpen('registerDialog')}>
                                Register
                            </Button>
                        </Typography>

                    </CardContent>
                </Card>
                <LoginForm
                    email={login.email}
                    password={login.password}
                    handleClose={this.handleClose('loginDialog')}
                    handleChange={this.handleChange}
                    open={loginDialog}
                    handleLogin={this.handleLogin}
                />
                <RegisterForm
                    handleClose={this.handleClose('registerDialog')}
                    handleChange={this.handleChange}
                    handleTabChange={this.handleTabChange}
                    tab={tab}
                    open={registerDialog}
                    hitchhiker={hitchhiker}
                    driver={driver}
                    handleRegister={this.handleRegister}
                />
            </div>
        );
    }
}

AuthPage.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(connect(null, {
    login: userActions.login,
    register: userActions.register,
    showSnackBar: projectActions.showSnackBar
})(AuthPage));

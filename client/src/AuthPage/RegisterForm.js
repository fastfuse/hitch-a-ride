import React from "react";

import {withStyles} from '@material-ui/core/styles';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Button from "@material-ui/core/Button/Button";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Slide from "@material-ui/core/Slide/Slide";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

const styles = {
    button: {
        color: "#fff",
        background: "#DF691A",
        margin: "0 16px",
        "&:hover": {
            background: "#DF691A",
            opacity: 0.9
        }
    },
    text: {
        color: "#ebebeb",
        fontFamily: "Lato",
        fontWeight: 100
    },
    dialog: {
        alignItems: "start"
    },
    dialogRoot: {
        maxWidth: 500,
        width: "100%",
        margin: "48px 12px"
    },
    margin: {
        margin: 8,
    },
    inputRoot: {
        'label + &': {
            marginTop: 24,
        },
    },
    input: {
        borderRadius: 4,
        backgroundColor: "#fff",
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '8px 12px',
        // transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
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
        ].join(','),

    },
    formLabel: {
        fontSize: 18,
        color: "#fff",
        "&$focused": {
            color: "#fff",
        }
    },
    focused: {},
    dialogContent: {
        display: "flex",
        flexDirection: "column",
        padding: "0 12px",
        background: "#4E5D6C"
    },
    dialogActions: {
        background: "#4E5D6C",
        margin: 0,
        padding: "8px 4px"
    },
    title: {
        background: "#4E5D6C",
        opacity: 0.75,
        padding: "20px 24px 16px",
        "& h2": {
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
        }
    },
    cancelButton: {
        color: "#fff",
        padding: 0
    },
    tabs: {
        justifyContent: "center",
        overflow: "hidden",
        borderRadius: 3,
        margin: "8px 4px"
    },
    tab: {
        color: "#fff",
        flexGrow: 1,
        borderRadius: 3,
        textAlign: "center",
        "&$selected": {
            background: "#2B3E50",
        }
    },
    selected: {}
};

function Transition(props) {
    return <Slide direction="down" {...props} timeout={300}/>;
}

class LoginForm extends React.Component {
    handleKeyPress = e => e.key === "Enter" && this.props.handleRegister();

    render() {
        const {
            handleClose, classes, open, handleChange, tab, handleTabChange, hitchhiker, driver, handleRegister
        } = this.props;

        return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                className={classes.dialog}
                classes={{paper: classes.dialogRoot}}
                keepMounted
                onClose={this.handleClose}
            >
                <DialogTitle className={classes.title}>
                    Register
                    <IconButton className={classes.cancelButton}>
                        <ClearIcon fontSize="small" onClick={handleClose}/>
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <Tabs
                        value={tab}
                        onChange={handleTabChange}
                        classes={{flexContainer: classes.tabs}}
                        TabIndicatorProps={{hidden: 'hidden'}}
                    >
                        <Tab label="Hitchhiker" classes={{root: classes.tab, selected: classes.selected}} disableRipple/>
                        <Tab label="Driver" classes={{root: classes.tab, selected: classes.selected}} disableRipple/>
                    </Tabs>
                    {tab === 0 &&
                    <React.Fragment>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="firstName" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                First name
                            </InputLabel>
                            <InputBase
                                id="firstName"
                                value={hitchhiker.firstName}
                                onChange={handleChange('hitchhiker')('firstName')}
                                onKeyPress={this.handleKeyPress}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="lastName" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Last name
                            </InputLabel>
                            <InputBase
                                id="lastName"
                                value={hitchhiker.lastName}
                                onChange={handleChange('hitchhiker')('lastName')}
                                onKeyPress={this.handleKeyPress}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="emailHitchhiker" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Email
                            </InputLabel>
                            <InputBase
                                id="emailHitchhiker"
                                value={hitchhiker.emailHitchhiker}
                                onChange={handleChange('hitchhiker')('emailHitchhiker')}
                                onKeyPress={this.handleKeyPress}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="passwordHitchhiker" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Password
                            </InputLabel>
                            <InputBase
                                id="passwordHitchhiker"
                                value={hitchhiker.passwordHitchhiker}
                                onChange={handleChange('hitchhiker')('passwordHitchhiker')}
                                onKeyPress={this.handleKeyPress}
                                type="password"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                    </React.Fragment>}
                    {tab === 1 &&
                    <React.Fragment>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="firstName" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                First name
                            </InputLabel>
                            <InputBase
                                id="firstName"
                                value={driver.firstName}
                                onChange={handleChange('driver')('firstName')}
                                onKeyPress={this.handleKeyPress}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="lastName" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Last name
                            </InputLabel>
                            <InputBase
                                id="lastName"
                                value={driver.lastName}
                                onChange={handleChange('driver')('lastName')}
                                onKeyPress={this.handleKeyPress}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="emailDriver" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Email
                            </InputLabel>
                            <InputBase
                                id="emailDriver"
                                value={driver.emailDriver}
                                onChange={handleChange('driver')('emailDriver')}
                                onKeyPress={this.handleKeyPress}
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="passwordDriver" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Password
                            </InputLabel>
                            <InputBase
                                id="passwordDriver"
                                value={driver.passwordDriver}
                                onChange={handleChange('driver')('passwordDriver')}
                                onKeyPress={this.handleKeyPress}
                                type="password"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="vehicleName" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Vehicle name
                            </InputLabel>
                            <InputBase
                                id="vehicleName"
                                value={driver.vehicleName}
                                onChange={handleChange('driver')('vehicleName')}
                                onKeyPress={this.handleKeyPress}
                                type="text"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                        <FormControl className={classes.margin}>
                            <InputLabel shrink htmlFor="vehicleId" className={classes.formLabel}
                                        FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                                Vehicle id
                            </InputLabel>
                            <InputBase
                                id="vehicleId"
                                value={driver.vehicleId}
                                onChange={handleChange('driver')('vehicleId')}
                                onKeyPress={this.handleKeyPress}
                                type="text"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.input,
                                }}
                            />
                        </FormControl>
                    </React.Fragment>}
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={handleRegister} variant="contained" className={classes.button}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(LoginForm);

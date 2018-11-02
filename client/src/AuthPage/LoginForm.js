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
        alignItems: "start",
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
    }
};

function Transition(props) {
    return <Slide direction="down" {...props} timeout={300}/>;
}

class LoginForm extends React.Component {
    handleKeyPress = e => e.key === "Enter" && this.props.handleLogin();

    render() {
        const {email, password, handleClose, classes, open, handleChange, handleLogin} = this.props;

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
                    Login
                    <IconButton className={classes.cancelButton}>
                        <ClearIcon fontSize="small" onClick={handleClose}/>
                    </IconButton>
                </DialogTitle>
                <DialogContent className={classes.dialogContent}>
                    <FormControl className={classes.margin}>
                        <InputLabel
                            shrink
                            htmlFor="email"
                            className={classes.formLabel}
                            FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}
                        >
                            Email
                        </InputLabel>
                        <InputBase
                            autoFocus
                            id="email"
                            value={email}
                            onChange={handleChange('login')('email')}
                            onKeyPress={this.handleKeyPress}
                            classes={{
                                root: classes.inputRoot,
                                input: classes.input,
                            }}
                        />
                    </FormControl>
                    <FormControl className={classes.margin}>
                        <InputLabel shrink htmlFor="password" className={classes.formLabel}
                                    FormLabelClasses={{root: classes.formLabel, focused: classes.focused}}>
                            Password
                        </InputLabel>
                        <InputBase
                            id="password"
                            value={password}
                            onChange={handleChange('login')('password')}
                            onKeyPress={this.handleKeyPress}
                            type="password"
                            classes={{
                                root: classes.inputRoot,
                                input: classes.input,
                            }}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions className={classes.dialogActions}>
                    <Button onClick={handleLogin} variant="contained" className={classes.button}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default withStyles(styles)(LoginForm);

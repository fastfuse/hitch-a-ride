import React from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import {withStyles} from '@material-ui/core/styles';


const styles = {
    success: {
        backgroundColor: "#43a047",
    },
    info: {
        backgroundColor: "#1976d2",
    },
    error: {
        backgroundColor: "#d32f2f",
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
};

function SnackBarContent(props) {
    const {classes, className, message, onClose, variant, ...other} = props;

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            message={
                <span className={classes.message}>
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon}/>
                </IconButton>,
            ]}
            {...other}
        />
    );
}

SnackBarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

export default withStyles(styles)(SnackBarContent);

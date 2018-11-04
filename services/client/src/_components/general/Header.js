import React from 'react';
import PropTypes from 'prop-types';

import {connect} from 'react-redux';

import {withStyles} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import userActions from '../../_actions/user.actions';
import history from '../../_helpers/history';
import {getFullName} from '../../_reducers';

const styles = {
    root: {
        flexGrow: 1,
        "& header": {
            background: "#2B3E50"
        }
    },
    grow: {
        flexGrow: 1,
    },
    dropDownButton: {
        "&:hover": {
            cursor: "pointer"
        }
    },
    userName: {
        color: "#eee",
        display: "inline"
    }
};

class Header extends React.Component {
    state = {
        auth: true,
        anchorEl: null,
    };

    handleMenu = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    handleLogout = () => {
        const {refreshToken} = this.props;

        this.props.logout(refreshToken);
    };

    render() {
        const {classes, userFullName} = this.props;
        const {auth, anchorEl} = this.state;
        const open = Boolean(anchorEl);

        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography
                            variant="title"
                            color="inherit"
                            className={classes.grow}
                            onClick={() => history.push('/')}
                            style={{cursor: "pointer"}}
                        >
                            Hitch A Ride
                        </Typography>
                        {auth && (
                            <div>
                                <div onClick={this.handleMenu} className={classes.dropDownButton}>
                                    <Typography variant="subheading" className={classes.userName}>
                                        {userFullName}
                                    </Typography>
                                    <IconButton
                                        aria-owns={open ? 'menu-appbar' : null}
                                        aria-haspopup="true"
                                        color="inherit"
                                    >
                                        <AccountCircle/>
                                    </IconButton>
                                </div>
                                <Menu
                                    id="menu-appbar"
                                    anchorEl={anchorEl}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={open}
                                    onClose={this.handleClose}
                                >
                                    <MenuItem onClick={() => history.push('/')}>Profile</MenuItem>
                                    <MenuItem onClick={() => history.push('/trips/add')}>Add trip</MenuItem>
                                    <MenuItem onClick={this.handleClose}>Settings</MenuItem>
                                    <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
    refreshToken: state.authentication.refresh,
    userFullName: getFullName(state)
});


export default connect(mapStateToProps, {logout: userActions.logout})(withStyles(styles)(Header));
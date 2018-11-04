import projectConstants from "../_constants/project.constants";
import userConstants from "../_constants/user.constants";

const initialState = {
    openSnackBar: false,
    snackVariant: "",
    snackMessage: "",
};

function project(state = initialState, action) {
    switch (action.type) {
        case projectConstants.SHOW_SNACK_BAR:
            return {
                openSnackBar: true,
                snackVariant: action.snackVariant,
                snackMessage: action.snackMessage
            };

        case projectConstants.HIDE_SNACK_BAR:
        case userConstants.LOGOUT_SUCCESS:
            return {...initialState};

        default:
            return state;
    }
}

export default project;

// Selectors
export const getSnackContent = state => ({
    openSnackBar: state.openSnackBar,
    snackVariant: state.snackVariant,
    snackMessage: state.snackMessage
});

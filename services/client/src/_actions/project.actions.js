import projectConstants from "../_constants/project.constants";

const showSnackBar = data => ({
    type: projectConstants.SHOW_SNACK_BAR,
    ...data
});

const hideSnackBar = () => ({
    type: projectConstants.HIDE_SNACK_BAR
});

const projectActions = {
    showSnackBar,
    hideSnackBar
};

export default projectActions;

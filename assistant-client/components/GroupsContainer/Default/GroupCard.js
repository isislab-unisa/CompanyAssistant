import PropTypes from 'prop-types';
import React, { useState } from 'react'
import EditGroup from './editGroup'
import store from "../../../store"
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';

// material-ui
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import { Avatar, List, ListItem, Grid, Button, ListItemAvatar, ListItemText, Typography, Menu, MenuItem } from '@material-ui/core';

// project imports
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import MainCard from '../../ui-component/cards/MainCard';
import { Delete, Edit } from '@material-ui/icons';
import "../../../utils/policiesConstants";

// assets
import { PeopleOutlineOutlined } from '@material-ui/icons';

// style constant
const useStyles = makeStyles((theme) => ({
    card: {
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: `linear-gradient(210.04deg, ${theme.palette.warning.dark} -50.94%, rgba(144, 202, 249, 0) 83.49%)`,
            borderRadius: '50%',
            top: '-30px',
            right: '-180px'
        },
        '&:before': {
            content: '""',
            position: 'absolute',
            width: '210px',
            height: '210px',
            background: `linear-gradient(140.9deg, ${theme.palette.warning.dark} -14.02%, rgba(144, 202, 249, 0) 70.50%)`,
            borderRadius: '50%',
            top: '-160px',
            right: '-130px'
        }
    },
    content: {
        padding: '16px !important',
    },
    avatar: {
        ...theme.typography.commonAvatar,
        ...theme.typography.largeAvatar,
        backgroundColor: theme.palette.warning.light,
        color: theme.palette.warning.dark,
        width: "2.5em",
        height: "2.5em",
        marginRight: "0.5em"
    },
    useButton: {
        margin: "0 auto",
        marginTop: "2em",
        backgroundColor: theme.palette.primary[500],
    },
    secondary: {
        color: theme.palette.grey[500],
        marginTop: '5px'
    },
    padding: {
        paddingTop: 0,
        paddingBottom: 0
    },
    avatarRight: {
        ...theme.typography.commonAvatar,
        ...theme.typography.mediumAvatar,
        backgroundColor: theme.palette.orange.main,
        color: theme.palette.orange.dark,
        zIndex: 1,
        float: "right",

    },
}));

const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
};

const handleClose = () => {
    setAnchorEl(null);
};


// exitFromGroupHandler() {
//     exitFromGroup((res, err) => {
//         if (err != null) {
//             console.log(err)
//         } else {
//             alert("Sei uscito dal gruppo")
//             container.updateLoaded()
//         }
//     }, group.name, store.getState().auth.username)
// }



const GroupCard = ({ isLoading, index, group, policies, updateHandler }) => {
    const classes = useStyles();
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const [openPopup, setOpenPopup] = useState(false);
    const [isLoaded, setIsLoaded] = useState([]);
    const [error, setError] = useState([]);

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    // open popup
    const openPopupHandler = () => {
        setOpenPopup(!openPopup)
    }
    const updateLoaded = () => {
        setOpenPopup(!openPopup)
        updateHandler()
    }

    return (
        <>

            <MainCard border={true} className={classes.card} contentClass={classes.content}>
                <Grid container direction="row" justifyContent="space-between">
                    <Grid item >
                        <List className={classes.padding}>

                            <ListItem alignItems="center" disableGutters onClick={openPopupHandler} className={classes.padding}>

                                <ListItemAvatar>
                                    <Avatar variant="rounded" className={classes.avatar}>
                                        <PeopleOutlineOutlined fontSize="large" />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    sx={{
                                        mt: 0.45,
                                        mb: 0.45
                                    }}
                                    className={classes.padding}
                                    primary={<Typography variant="h3">{group.name}</Typography>}
                                    secondary={
                                        <Typography variant="h5" className={classes.secondary}>
                                            20 users<br />
                                            23 active vm<br />
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        </List>
                    </Grid>
                    {
                        policies.includes(UPDATE_USER_POLICY) && store.getState().auth.userType != "admin" ? <Grid item >
                            <Avatar
                                variant="rounded"
                                className={classes.avatarRight}
                                aria-controls="menu-earning-card"
                                aria-haspopup="true"
                                onClick={null}
                            >
                                <MoreHorizIcon fontSize="inherit" />
                            </Avatar>
                            <Menu
                                id="menu-earning-card"
                                anchorEl={anchorEl}
                                keepMounted
                                open={Boolean(anchorEl)}
                                onClose={handleClose}
                                variant="selectedMenu"
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right'
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right'
                                }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Delete fontSize="inherit" className={classes.menuItem} /> &nbsp; delete
                                </MenuItem>
                                <MenuItem onClick={handleClose}>

                                    <Edit fontSize="inherit" className={classes.menuItem} /> &nbsp; edit
                                </MenuItem>
                            </Menu>
                        </Grid> : null
                    }
                </Grid>
            </MainCard>

            {/* Popup per la modifica */}
            <Dialog fullScreen={fullScreen} open={openPopup} onClose={openPopupHandler} aria-labelledby="responsive-dialog-title">
                <EditGroup policies={policies} container={this} openPopupHandler={openPopupHandler} updateLoaded={updateLoaded} group={group} />
            </Dialog>
        </>
    );

}

GroupCard.propTypes = {
    isLoading: PropTypes.bool
};
export default GroupCard;
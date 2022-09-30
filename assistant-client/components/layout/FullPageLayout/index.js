import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { makeStyles, useTheme } from '@material-ui/styles';
import { AppBar, CssBaseline, Toolbar, useMediaQuery } from '@material-ui/core';

// third-party
import clsx from 'clsx';

import theme from '../../../themes/index'

// project imports
import Breadcrumbs from '../../ui-component/extended/Breadcrumbs';
import navigation from '../../menu-items';
import { drawerWidth } from '../../../store/constant';
import { SET_MENU } from '../../../store/actions';

// assets
import { IconChevronRight } from '@tabler/icons';

// style constant
const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex'
    },
    content: {
        ...theme.typography.fullPageContent
    },
}));

//-----------------------|| MAIN LAYOUT ||-----------------------//

const FullPageLayout = ({ children }) => {
    const classes = useStyles();
    const theme = useTheme();
    const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

    // Handle left drawer
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch({ type: SET_MENU, opened: !matchDownMd });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [matchDownMd]);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <main
                className={classes.content}>
                <div>{children}</div>
            </main>
        </div>
    );
};
export default FullPageLayout;

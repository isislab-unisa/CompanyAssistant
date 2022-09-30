import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@material-ui/core';

// project imports
import config from '../../../../utils/config';
import Logo from './../../../ui-component/Logo';

//-----------------------|| MAIN LOGO ||-----------------------//

const LogoSection = () => {
    return (
        <ButtonBase disableRipple  to={config.defaultPath}>
            <Logo />
        </ButtonBase>
    );
};

export default LogoSection;

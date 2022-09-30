import React from 'react';

// material-ui
import { Typography, Stack } from '@material-ui/core';

//-----------------------|| FOOTER - AUTHENTICATION 2 & 3 ||-----------------------//

const AuthFooter = () => {
    return (
        <Stack direction="row" justifyContent="space-between">
            <Typography variant="subtitle2"  href="https://berrydashboard.io" target="_blank" underline="hover">
                berrydashboard.io
            </Typography>
            <Typography variant="subtitle2" href="https://codedthemes.com" target="_blank" underline="hover">
                &copy; codedthemes.com
            </Typography>
        </Stack>
    );
};

export default AuthFooter;

import React from 'react';
import {logUserNew} from '../../controllers/loginController'

// material-ui
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormHelperText,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Stack,
    Typography
} from '@material-ui/core';

// third party
import * as Yup from 'yup';
import { Formik, } from 'formik';

// project imports
import MainCard from '../ui-component/cards/MainCard';
// assets
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';


// style constant
const useStyles = makeStyles((theme) => ({
    loginInput: {
        ...theme.typography.customInput
    },
    card: {
        overflow: 'hidden',
        position: 'relative',
        maxWidth: '60em',
        margin: '0 auto',
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
    submitButton: {
        width: "7em",
        margin: "0 auto"
    },
    submitBox: {
        textAlign: "center"
    },
    divisor: {
        margin: "1em"
    },
}));


const LoginForm = (props, { ...others }) => {
    const classes = useStyles();

    const [showPassword, setShowPassword] = React.useState(false);
    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    return (
        <>
            <MainCard border={true} className={classes.card} contentClass={classes.content}>
                <Typography variant="h1" align="center">Vm4All</Typography>
                <Divider className={classes.divisor}/>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().max(255).required('Password is required')
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                        try {
                            logUserNew(values.username,values.password);
                            setStatus({ success: true });
                            setSubmitting(false);
                        } catch (err) {
                            setErrors(err);
                            setStatus({ success: false });
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit} {...others}>
                            <FormControl fullWidth error={Boolean(touched.username && errors.username)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-username-login"
                                    type="username"
                                    value={values.email}
                                    name="username"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="Username"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.username && errors.username && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {' '}
                                        {errors.username}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            <FormControl fullWidth error={Boolean(touched.password && errors.password)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-login"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.password}
                                    name="password"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <Visibility /> : <VisibilityOff />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.password && errors.password && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {' '}
                                        {errors.password}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Stack direction="row" alignItems="right" justifyContent="space-between" spacing={1}>
                                <Typography
                                    variant="subtitle1"
                                    component={"a"}
                                    to="/pages/forgot-password/forgot-password3"
                                    color="secondary"
                                    sx={{ textDecoration: 'none' }}
                                >
                                    Forgot Password?
                                </Typography>
                            </Stack>
                            {errors.submit && (
                                <Box
                                    sx={{
                                        mt: 3
                                    }}
                                >
                                    <FormHelperText error>{errors.submit}</FormHelperText>
                                </Box>
                            )}

                            <Box className={classes.submitBox} >
                                <Button
                                    className={classes.submitButton}
                                    disableElevation
                                    disabled={isSubmitting}
                                    fullWidth
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                >
                                    Sign in
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </MainCard>
        </>
    );
};

export default LoginForm;

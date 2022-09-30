import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/styles';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { register } from '../../../controllers/userController';

import dangerImage from '../../../assets/images/danger.png'

import InfoModal from '../../ui-component/infoModal';
import { getRoles } from '../../../controllers/roleController';
import { getGroups } from '../../../controllers/groupController';

import {
    Grid,
    Divider,
    Typography,
    FormControl,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
    InputLabel,
    Select,
    MenuItem,
    Dialog,
    Button,
    Box,
    useMediaQuery
} from '@material-ui/core';
import MainCard from '../../ui-component/cards/MainCard';
import AnimateButton from '../../ui-component/extended/AnimateButton';
// material-ui
import { useTheme } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// project imports

// assets

const useStyles = makeStyles((theme) => ({
    loginInput: {
        ...theme.typography.customInput
    },
    formBox: {
        padding: '2em'
    },
    select: {
        marginBottom: '1em'
    },
    divisor: {
        margin: "1em"
    },
    submitButton: {
        width: "6em",
        margin: "0 auto"
    },
    submitBox: {
        textAlign: "center"
    },
    card: {
        overflow: 'hidden',
        position: 'relative',
        maxWidth: '70em',
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
    subTitle: {
        textAlign: "center",
        margin: "1em",
        color: theme.palette.grey[700]
    },
    styledToggleButtonGroup: {
        '& .MuiToggleButtonGroup-grouped': {
            margin: theme.spacing(0.5),
            border: 0,
            '&.Mui-disabled': {
                border: 0,
            },
            '&:not(:first-of-type)': {
                borderRadius: theme.shape.borderRadius,
            },
            '&:first-of-type': {
                borderRadius: theme.shape.borderRadius,
            },
        },
        margin: "1em",
        marginLeft: "0"
    },


}));

//= ==============================|| AUTH3 - REGISTER ||===============================//

const CreateUser = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [openPopup, setOpenPopup] = useState(false);
    const [isLoading, setIsLoading] = React.useState(false)
    const [isLoadingGroups, setIsLoadingGroups] = React.useState(false)
    const [roles, setRoles] = React.useState([])
    const [groups, setGroups] = React.useState([])
    const [selectedGroups, setSelectedGroups] = React.useState([])
    const [showPassword, setShowPassword] = React.useState(false);

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleUserCreated = () => {
        window.location.href = "/users";
    }

    const openPopupHandler = () => {
        setOpenPopup(!openPopup)
    }

    const handleChangeGroups = (event, groups) => {
        setSelectedGroups(groups);
    }

    useEffect(() => {
        getRoles((result, error) => {
            if (error != null) {
                alert(error)
            } else {
                setRoles(result)
                setIsLoading(false)
            }
        })

        getGroups((result, error) => {
            if (error != null) {
                alert(error)
            } else {
                setGroups(result)
                setIsLoadingGroups(false)
            }
        })
    }, [])

    if (isLoading || isLoadingGroups ) return (<h1>Loading...</h1>)

    return (
        <>
            <MainCard border={true} className={classes.card} contentClass={classes.content}>
                <Typography variant="h2" className={classes.subTitle}>User data</Typography>
                <Divider className={classes.divisor} />
                <Formik
                    initialValues={{
                        firstName: '',
                        lastName: '',
                        username: '',
                        password: '',
                        email: '',
                        checkPassword: '',
                        role: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        firstName: Yup.string().max(10).required('First name is required').matches(
                            /^[a-z]{5,10}/,
                            "Must be only lowercase and must contain only letters. Min 5 characters. Max 10 characters"
                        ),
                        lastName: Yup.string().max(10).required('Last name is required').matches(
                            /^[a-z]{5,10}/,
                            "Must be only lowercase and must contain only letters. Min 5 characters. Max 10 characters"
                        ),
                        username: Yup.string().max(10).required('Username is required').matches(
                            /^[a-z]{5,10}/,
                            "Must be only lowercase and must contain only letters. Min 5 characters. Max 10 characters"
                        ),
                        password: Yup.string().max(255).required('Password is required').matches(
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
                            "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
                        ),
                        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
                        checkPassword: Yup.string().test('passwords-match', 'Passwords must match', function (value) {
                            return this.parent.password === value
                        }),
                        role: Yup.string().required('Role is required'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting, resetForm }) => {
                        try {
                            register((_, error) => {
                                if (error != null) { alert(error); console.log(error); setErrors(error); }
                                setSubmitting(false);
                                resetForm();
                                setOpenPopup(true)
                            }, { username: values.username, password: values.password, name: values.firstName, lastname: values.lastName, email: values.email, role: values.role, groups: selectedGroups })
                        } catch (err) {
                            console.error(err);
                            setErrors(err);
                            setSubmitting(false);
                        }
                    }}
                >

                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form noValidate onSubmit={handleSubmit} className={classes.formBox}>
                            <Grid container fullWidth spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={Boolean(touched.firstName && errors.firstName)} className={classes.loginInput}>
                                        <InputLabel htmlFor="name">First Name</InputLabel>
                                        <OutlinedInput
                                            value={values.firstName}
                                            name="firstName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="firstName"
                                            inputProps={{
                                                classes: {
                                                    notchedOutline: classes.notchedOutline
                                                }
                                            }}
                                        />
                                        {touched.firstName && errors.firstName && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {' '}
                                                {errors.firstName}{' '}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={Boolean(touched.lastName && errors.lastName)} className={classes.loginInput}>
                                        <InputLabel htmlFor="outlined-adornment-email-login">lastName</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-lastName-login"
                                            type="lastName"
                                            value={values.lastName}
                                            name="lastName"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Last Name"
                                            inputProps={{
                                                classes: {
                                                    notchedOutline: classes.notchedOutline
                                                }
                                            }}
                                        />
                                        {touched.lastName && errors.lastName && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {' '}
                                                {errors.lastName}{' '}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <FormControl fullWidth error={Boolean(touched.username && errors.username)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">Username</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-username-login"
                                    type="username"
                                    value={values.username}
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
                            <FormControl fullWidth error={Boolean(touched.email && errors.email)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-email-login">E-mail</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-username-login"
                                    type="email"
                                    value={values.email}
                                    name="email"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    label="E-mail"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.email && errors.email && (
                                    <FormHelperText error id="standard-weight-helper-text-email-login">
                                        {' '}
                                        {errors.email}{' '}
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
                            <FormControl fullWidth error={Boolean(touched.checkPassword && errors.checkPassword)} className={classes.loginInput}>
                                <InputLabel htmlFor="outlined-adornment-password-login">Check Password</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password-login"
                                    type={showPassword ? 'text' : 'password'}
                                    value={values.checkPassword}
                                    name="checkPassword"
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
                                    label="Check Password"
                                    inputProps={{
                                        classes: {
                                            notchedOutline: classes.notchedOutline
                                        }
                                    }}
                                />
                                {touched.checkPassword && errors.checkPassword && (
                                    <FormHelperText error id="standard-weight-helper-text-password-login">
                                        {' '}
                                        {errors.checkPassword}{' '}
                                    </FormHelperText>
                                )}
                            </FormControl>
                            <Divider className={classes.divisor} />
                            <FormControl fullWidth error={Boolean(touched.role && errors.role)} className={classes.select}>
                                <InputLabel id="role">Role</InputLabel>
                                <Select
                                    labelId="role"
                                    id="role"
                                    name="role"
                                    value={values.role}
                                    onChange={handleChange}
                                >
                                    {roles.map(element => <MenuItem value={element.name}>{element.name}</MenuItem>)}
                                </Select>
                                <FormHelperText>{(errors.role && touched.role) && errors.role}</FormHelperText>
                            </FormControl>
                            <Divider className={classes.divisor} />
                            <Typography variant="h2" className={classes.subTitle}>Select groups</Typography>
                            <Box >

                                <ToggleButtonGroup
                                    size="small"
                                    type="checkbox"
                                    name="tags"
                                    onChange={handleChangeGroups}
                                    aria-label="tags"
                                    value={selectedGroups}
                                    defaultValue={selectedGroups}
                                    className={classes.styledToggleButtonGroup}
                                >


                                    {groups.map(element => <ToggleButton aria-label={element.name} value={element.name}>{element.name}</ToggleButton>)}
                                </ToggleButtonGroup>
                            </Box>
                            <Divider className={classes.divisor} />
                            <Box className={classes.submitBox}>
                                <AnimateButton >
                                    <Button className={classes.submitButton}
                                        disableElevation
                                        disabled={isSubmitting}
                                        fullWidth
                                        size="large"
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                    >
                                        Create
                                    </Button>
                                </AnimateButton>
                            </Box>
                        </form>
                    )}

                </Formik>
            </MainCard>

            <Dialog fullScreen={fullScreen} open={openPopup} onClose={openPopupHandler} aria-labelledby="responsive-dialog-title">
                <InfoModal message="User has been created" buttonText="Go to users" closeHandler={openPopupHandler} handler={handleUserCreated} image={dangerImage} />
            </Dialog>
        </>
    );
};

export default CreateUser;

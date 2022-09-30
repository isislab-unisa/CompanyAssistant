import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/styles';

import { getVmsTypes } from '../../../controllers/vmController';
import { getTags } from '../../../controllers/tagController';
import { getAccounts } from '../../../controllers/accountController';
import { create } from '../../../controllers/vmController';
import { gridSpacing } from '../../../store/constant';

import dangerImage from '../../../assets/images/danger.png'

import InfoModal from '../../ui-component/infoModal';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import {
    Grid,
    Divider,
    FormControl,
    TextField,
    Dialog,
    OutlinedInput,
    InputAdornment,
    IconButton,
    FormHelperText,
    Autocomplete,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Box,
    useMediaQuery,
    Typography
} from '@material-ui/core';
import MainCard from '../../ui-component/cards/MainCard';
import AnimateButton from '../../ui-component/extended/AnimateButton';
// material-ui
import { useTheme } from '@material-ui/core/styles';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { Info } from '@material-ui/icons';


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
    tagTextField: {
        width: "100%",
    },
    subTitle: {
        textAlign: "center",
        margin: "1em",
        color: theme.palette.grey[700]
    }


}));

//= ==============================|| AUTH3 - REGISTER ||===============================//

const CreateVm = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [openPopup, setOpenPopup] = useState(false);
    const [vmTypes, setVmTypes] = React.useState([])
    const [accounts, setAccounts] = React.useState([])
    const [tags, setTags] = React.useState([])
    const [selectedProvider, setSelectedProvider] = React.useState('aws')
    const [selectedTags, setSelectedTags] = React.useState([])
    const [newTags, setNewTags] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isLoadingAccount, setIsLoadingAccount] = React.useState(true)
    const [isLoadingTags, setIsLoadingTags] = React.useState(true)
    const [showPassword, setShowPassword] = React.useState(false);

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleChangeTags = (event, tags) => {
        setSelectedTags(tags);
    }

    const handleMachineCreated =()=>{
        window.location.href = "/vms";
    }

    const openPopupHandler = ()=>{
        setOpenPopup(!openPopup)
    }

    const handlerInsertTag = () => {
        var tags = newTags
        var newTag = document.getElementById("formTag").value
        var found = false
        tags.map((item, i) => {
            if (item == newTag) {
                found = true;
            }
        })
        if (!found) {
            setNewTags(newTags.concat(newTag))
        }
        document.getElementById("formTag").value = null;
    }

    var providers = {
        "providers": []
    }

    useEffect(() => {
        getVmsTypes((result, error) => {
            if (error != null) {
                alert(error)
            } else {
                setVmTypes(result)
                setIsLoading(false)
            }
        })

        getAccounts((result, error) => {
            if (error != null) {
                alert(error)
            } else {
                setAccounts(result)
                setIsLoadingAccount(false)
            }
        })

        getTags((result, error) => {
            if (error != null) {
                alert(error)
            } else {
                setTags(result)
                setIsLoadingTags(false)
            }
        })
    }, [])

    if (isLoading || isLoadingAccount || isLoadingTags) return (<h1>Loading...</h1>)



    vmTypes.forEach(element => {
        if (!providers["providers"].includes(element.provider)) {
            providers["providers"].push(element.provider)
            providers[element.provider] = [element.os]
        } else if (!providers[element.provider].includes(element.os)) {
            providers[element.provider].push(element.os)
        }
    });


    return (
        <>
            <MainCard border={true} className={classes.card} contentClass={classes.content}>
                <Typography variant="h2" className={classes.subTitle}>Virtual machine data</Typography>
                <Divider className={classes.divisor} />
                <Formik
                    initialValues={{
                        name: '',
                        username: '',
                        password: '',
                        checkPassword: '',
                        account: '',
                        os: '',
                        size: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().max(10).required('Name is required').matches(
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
                        checkPassword: Yup.string().test('passwords-match', 'Passwords must match', function (value) {
                            return this.parent.password === value
                        }),
                        account: Yup.string().required('Provider is required'),
                        os: Yup.string().required('Os is required'),
                        size: Yup.string().required('Size is required'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting,resetForm }) => {
                        try {
                            create((_,error) => {
                                if (error != null) { alert(error); console.log(error); setErrors(error); }
                                setSubmitting(false);
                                resetForm();
                                setOpenPopup(true)
                                
                            }, { name: values.name, osType: values.size, username: values.username, password: values.password, account: values.account, selectedTags: selectedTags })
                        } catch (err) {
                            console.error(err);
                            setErrors(err);
                            setSubmitting(false);
                        }
                    }}
                >

                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form id="formCreateVm" noValidate onSubmit={handleSubmit} className={classes.formBox}>
                            <Grid container fullWidth spacing={matchDownSM ? 0 : 2}>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth error={Boolean(touched.name && errors.name)} className={classes.loginInput}>
                                        <InputLabel htmlFor="name">Name</InputLabel>
                                        <OutlinedInput
                                            value={values.name}
                                            name="name"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Name"
                                            inputProps={{
                                                classes: {
                                                    notchedOutline: classes.notchedOutline
                                                }
                                            }}
                                        />
                                        {touched.name && errors.name && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {' '}
                                                {errors.name}{' '}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
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
                                </Grid>
                            </Grid>
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
                            <FormControl fullWidth error={Boolean(touched.account && errors.account)} className={classes.select}>
                                <InputLabel id="account">Account</InputLabel>
                                <Select
                                    labelId="account"
                                    id="account"
                                    name="account"
                                    value={values.account}
                                    onChange={(e) => {
                                        var index = accounts.findIndex(element => element.name.includes(e.target.value))
                                        setSelectedProvider(accounts[index].provider);
                                        handleChange(e);
                                    }
                                    }
                                >
                                    {accounts.map(element => <MenuItem value={element.name}>{element.name}</MenuItem>)}
                                </Select>
                                <FormHelperText>{(errors.account && touched.account) && errors.account}</FormHelperText>
                            </FormControl>
                            <FormControl fullWidth error={Boolean(touched.os && errors.os)} className={classes.select}>
                                <InputLabel id="os">Os</InputLabel>
                                <Select
                                    labelId="os"
                                    id="os"
                                    name="os"
                                    value={values.os}
                                    onChange={handleChange}
                                >
                                    {
                                        providers[selectedProvider].map(element => <MenuItem value={element}>{element}</MenuItem>)
                                    }

                                </Select>
                                <FormHelperText>{(errors.os && touched.os) && errors.os}</FormHelperText>
                            </FormControl>
                            <FormControl fullWidth error={Boolean(touched.size && errors.size)} className={classes.select}>
                                <InputLabel id="size">Size</InputLabel>
                                <Select
                                    labelId="size"
                                    id="size"
                                    name="size"
                                    value={values.size}
                                    onChange={handleChange}
                                >
                                    {

                                        vmTypes.map(element => {
                                            if (element.provider == selectedProvider)
                                                return <MenuItem value={element.id}>{element.size}</MenuItem>

                                        })
                                    }
                                </Select>
                                <FormHelperText>{(errors.size && touched.size) && errors.size}</FormHelperText>
                            </FormControl>


                            <Divider className={classes.divisor} />

                            <Typography variant="h3" className={classes.subTitle}>Add tags</Typography>

                            <Grid container spacing={gridSpacing}>
                                <Grid item lg={11} sm={11} md={11} xs={11}>
                                    <TextField
                                        id="formTag"
                                        name="newTag"
                                        label="New Tag"
                                        className={classes.tagTextField}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <Button variant="outlined" onClick={handlerInsertTag}>Add</Button>
                                </Grid>
                            </Grid>


                            <Box >

                                <ToggleButtonGroup
                                    size="small"
                                    type="checkbox"
                                    name="tags"
                                    onChange={handleChangeTags}
                                    aria-label="tags"
                                    value={selectedTags}
                                    defaultValue={[]}
                                    className={classes.styledToggleButtonGroup}
                                >


                                    {tags.map(element => <ToggleButton aria-label={element.name} value={element.name}>{element.name}</ToggleButton>)}
                                    {newTags.map(element => <ToggleButton aria-label={element} value={element}>{element}</ToggleButton>)}
                                </ToggleButtonGroup>
                            </Box>
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

            {/* Popup per la modifica */}
            <Dialog fullScreen={fullScreen} open={openPopup} onClose={openPopupHandler} aria-labelledby="responsive-dialog-title">
                <InfoModal message="The machine has been created" buttonText="Go to vms" closeHandler={openPopupHandler} handler={handleMachineCreated} image={dangerImage}/>
            </Dialog>
        </>
    );
};

export default CreateVm;

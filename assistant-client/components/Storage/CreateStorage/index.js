import React, { useEffect, useState } from 'react';

import * as Yup from 'yup';
import { Formik } from 'formik';
import { makeStyles } from '@material-ui/styles';

import { getTags } from '../../../controllers/tagController';
import { getAccounts } from '../../../controllers/accountController';
import { create } from '../../../controllers/storageController';
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
    FormHelperText,
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

const CreateStorage = () => {
    const classes = useStyles();
    const theme = useTheme();
    const matchDownSM = useMediaQuery(theme.breakpoints.down('sm'));
    const [openPopup, setOpenPopup] = useState(false);
    const [accounts, setAccounts] = React.useState([])
    const [tags, setTags] = React.useState([])
    const [selectedProvider, setSelectedProvider] = React.useState('aws')
    const [selectedTags, setSelectedTags] = React.useState([])
    const [newTags, setNewTags] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(true)
    const [isLoadingAccount, setIsLoadingAccount] = React.useState(true)
    const [isLoadingTags, setIsLoadingTags] = React.useState(true)

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

    const handleStorageCreated =()=>{
        window.location.href = "/storage";
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

    if ( isLoadingAccount || isLoadingTags) return (<h1>Loading...</h1>)


    return (
        <>
            <MainCard border={true} className={classes.card} contentClass={classes.content}>
                <Typography variant="h2" className={classes.subTitle}>Create storage</Typography>
                <Divider className={classes.divisor} />
                <Formik
                    initialValues={{
                        name: '',
                        size: '',
                        account: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        name: Yup.string().max(10).required('Name is required').matches(
                            /^[a-z]{5,10}/,
                            "Must be only lowercase and must contain only letters. Min 5 characters. Max 10 characters"
                        ),
                        size: Yup.number().max(5120).required('Size is required').min(1).positive(),
                        account: Yup.string().required('Provider is required'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting,resetForm }) => {
                        try {
                            create((_,error) => {
                                if (error != null) { alert(error); console.log(error); setErrors(error); }
                                setSubmitting(false);
                                resetForm();
                                setOpenPopup(true)
                                
                            }, { name: values.name,  size: values.size,account: values.account, selectedTags: selectedTags })
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
                                    <FormControl fullWidth error={Boolean(touched.size && errors.size)} className={classes.loginInput}>
                                        <InputLabel htmlFor="outlined-adornment-email-login">Size</InputLabel>
                                        <OutlinedInput
                                            id="outlined-adornment-username-login"
                                            type="username"
                                            value={values.size}
                                            name="size"
                                            onBlur={handleBlur}
                                            onChange={handleChange}
                                            label="Size"
                                            inputProps={{
                                                classes: {
                                                    notchedOutline: classes.notchedOutline
                                                }
                                            }}
                                        />
                                        {touched.size && errors.size && (
                                            <FormHelperText error id="standard-weight-helper-text-email-login">
                                                {' '}
                                                {errors.size}{' '}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                          <br></br>
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
                <InfoModal message="The storage has been created" buttonText="Go to storage page" closeHandler={openPopupHandler} handler={handleStorageCreated} image={dangerImage}/>
            </Dialog>
        </>
    );
};

export default CreateStorage;

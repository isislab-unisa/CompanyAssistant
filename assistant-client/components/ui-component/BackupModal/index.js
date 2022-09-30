import React from 'react';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { backupVm } from '../../../controllers/vmController';
import { getStorage } from '../../../controllers/storageController';
import * as Yup from 'yup';
import { Formik } from 'formik';
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
    Box,
    useMediaQuery,
    Typography
} from '@material-ui/core';

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


const BackupModal = ({message,buttonText,closeHandler,handler,image,vmName}) => {

    const classes = useStyles();
    const [storages, setStorages] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const [selectedStorage, setSelectedStorage] = React.useState([]);


    const backupHandler = ()=>{
        console.log("wewewe")
        backupVm((result,error)=>{
            if(error != null) console.log(error)
            else console.log(result)
        },vmName,selectedStorage)
    }

    useEffect(() => {
        if (!isLoading) return
        getStorage((result, error) => {
            if (error != null) {
                alert(error);
            } else {
                console.log("result++++++");
                console.log(result)
                setStorages(result);
                setLoading(false);
            }
        });
    }, [isLoading]);

    if (isLoading)
        return <h1>Loading...</h1>
    else
        return (
            <> 
            <DialogContent>
            <DialogContentText>
            <div style={{ marginTop: '10px' }}><div
                    style={{
                    padding: "32px 20px 70px 20px", display: "inline-flex",
                    verticalAlign: "center",
                    }}
                >
                    <img src={image}
                    style={{
                        verticalAlign: "center",
                        width: "4rem",
                        height: "4rem",
                        cursor: "pointer",
                        marginRight: "5%"
                    }}
                    />
                    <h5 style={{
                    verticalAlign: "center",
                    }}>{message} </h5>
                </div>
            </div>
            </DialogContentText>

            <Formik
                    initialValues={{
                        storage: '',
                        submit: null
                    }}
                    validationSchema={Yup.object().shape({
                        storage: Yup.string().required('Storage is required'),
                    })}
                    onSubmit={async (values, { setErrors, setStatus, setSubmitting,resetForm }) => {
                        try {
                        } catch (err) {
                            console.error(err);
                            setErrors(err);
                            setSubmitting(false);
                        }
                    }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                        <form id="formBackupVm" noValidate onSubmit={handleSubmit} className={classes.formBox}>
                            <FormControl fullWidth error={Boolean(touched.storage && errors.storage)} className={classes.select}>
                                <InputLabel id="storage">storage</InputLabel>
                                <Select
                                    labelId="storage"
                                    id="storage"
                                    name="storage"
                                    value={values.storage}
                                    onChange={(e) => {
                                        var index = storages.findIndex(element => (element.name == e.target.value))
                                        setSelectedStorage(storages[index].name);
                                        handleChange(e);
                                    }
                                    }
                                >
                                    {storages.map(element => <MenuItem value={element.name}>{element.name}</MenuItem>)}
                                </Select>
                                <FormHelperText>{(errors.storage && touched.storage) && errors.storage}</FormHelperText>
                            </FormControl>
                        </form>
                    )}
                </Formik>

            </DialogContent>
            <DialogActions>
            <Button variant="danger" onClick={closeHandler}>
                Chiudi
            </Button>
            <Button variant="danger" onClick={handler}>
                No
            </Button>
            <Button onClick={()=>{backupHandler();handler()}}>
                {buttonText}
            </Button>

            </DialogActions>
        </>



        )

}

export default BackupModal;
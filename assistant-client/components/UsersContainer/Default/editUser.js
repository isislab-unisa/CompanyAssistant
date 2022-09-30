
import React, {useEffect, useState } from 'react';
// material-ui
import { Grid } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


import {Box} from '@material-ui/core';

import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import "../../../utils/policiesConstants";

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
const EditUser = ({user, openPopupHandler}) => {
  const classes = useStyles();
  const theme = useTheme();
  const [selectedGroups, setSelectedGroups] = useState([]);

  useEffect(()=>{
    setSelectedGroups(user.groups)
  },[])



  const handleChangeGroups= (event, groups) => {
    setSelectedGroups(groups);
}

    return (
      <>

        <DialogTitle id="responsive-dialog-title">
          <Grid container direction="row" style={{
            display: "flex",
            alignItems: "center"
          }}>
            <Grid Item style={{ verticalAlign: "middle", fontSize: "1.8em" }}> &nbsp; {user.username}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>

            <Box >

              <ToggleButtonGroup
                size="small"
                type="checkbox"
                name="groups"
                onChange={handleChangeGroups}
                aria-label="groups"
                value={selectedGroups}
                defaultValue={[]}
                className={classes.styledToggleButtonGroup}
              >

                {user.groups.map(element => <ToggleButton aria-label={element} value={element}>{element}</ToggleButton>)}
              </ToggleButtonGroup>
            </Box>

          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={openPopupHandler}>
            Close
          </Button>

          <Button autoFocus onClick={() => {alert("DA IMPLEMENTARE")}}>
            Save
          </Button>

        </DialogActions>
      </>
    )
  
}

export default EditUser;
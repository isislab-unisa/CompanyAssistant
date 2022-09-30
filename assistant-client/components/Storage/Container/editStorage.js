import React from 'react';

// material-ui
import { Grid } from '@material-ui/core';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';



import Divider from '@mui/material/Divider';

import { styled } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import dangerImage from '../../../assets/images/danger.png'
import { edit } from "../../../controllers/storageController";
import "../../../utils/policiesConstants";
import store from '../../../store'

const steps = [{ title: 'Tag' }, { title: 'Conferma' },]

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
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
}));
export default class EditStorage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storageName: "",
      selectedTags: [],
      tags: [],
      tempTags: [],
      newTag: "",
      activeStep: 1,
    }
  }

  componentDidMount() {
    this.setState({ storageName: this.props.storage.name })
    this.setState({ tags: this.props.storage.tags })
    this.setState({ selectedTags: this.props.storage.tags })
  }



  editStorageHandler(newStorage) {

    edit((res, err) => {
      if (err != null) {
        alert(err)
      } else {
        this.props.updateLoaded()
      }
    }, newStorage)
  }

  handleOnClickNext = () => {
    let nextStep = this.state.activeStep + 1;
    this.setState({ activeStep: nextStep })
  }

  handleOnClickBack = () => {
    let prevStep = this.state.activeStep - 1;
    this.setState({ activeStep: prevStep })
  }

  handleSearchBar(e) {
    var array = []
    var users = this.state.users

    users.map((item, index) => {
      if (item.startsWith(e.target.value.trim()))
        array.push(item)
    })

    this.setState({ filteredUsers: array })
  }

  render() {

    const insertTagHandler = () => {
      var tagsArray = this.state.tempTags
      var found = false
      tagsArray.map((item, i) => {
        if (item == this.state.newTag) {
          found = true;
        }
      })
      if (!found) {
        tagsArray[tagsArray.length] = this.state.newTag
        this.setState({ tempTags: tagsArray })
      }
      document.getElementById("formTag").reset();
    }

    const handleChange = (event, selectedTags) => {
      if (selectedTags.length > 0) {
        this.setState({
          selectedTags: selectedTags
        })
      }
      else
        this.setState({
          selectedTags: []
        })
    };

    const handleChangeUserList = (selectedUsers) => {
      if (selectedUsers.length > 0) {
        this.setState({
          selectedUsers: selectedUsers
        })
      }
      else
        this.setState({
          selectedUsers: []
        })
    };

    function stringAvatar(name) {
      return {
        sx: {
          bgcolor: deepPurple[500],
          color: "#ffffff"
        },
        children:name
      };
    }

    function stringToColor(string) {
      let hash = 0;
      let i;

      /* eslint-disable no-bitwise */
      for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
      }

      let color = '#';

      for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.substr(-2);
      }
      /* eslint-enable no-bitwise */

      return color;
    }
    const alignment = 'left', setAlignment = 'left';
    const formats = ['italic']
    return (
      <>

        <DialogTitle id="responsive-dialog-title">
          <Grid container direction="row" style={{
            display: "flex",
            alignItems: "center"
          }}>
            <Grid item><Avatar {...stringAvatar(this.props.storage.name)} /> </Grid>
            <Grid Item style={{ verticalAlign: "middle", fontSize: "1.8em" }}> &nbsp; {this.props.storage.name}</Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>

            <div style={{ marginTop: '10px' }}>
              {this.state.activeStep === 1 ?
                <div>
                  {/* FORM TAG */}
                  <form style={{ width: "100%" }} id="formTag">
                    <FormGroup controlId="formBasicCredentials" style={{ margin: "5px 0 10px 0" }}>
                      <FormLabel>Aggiungi tag all'elenco</FormLabel>
                      <div style={{ width: "100%", padding: "1em", display: "inline-flex", verticalAlign: "middle", overflow: "auto" }}>
                        <TextField required id="outlined-required" name="newTag" type="text" onChange={e => this.setState({ newTag: e.target.value })} label="newTag" disabled={!this.props.policies.includes(UPDATE_STORAGE_POLICY) && store.getState().auth.userType != "admin"} style={{ margin: "2px 5% 20px 0", width: "70%" }} />
                        <Button style={{ width: "20%", height: "40px", marginTop: "0.5em" }} size="large" variant="outlined" disabled={!this.props.policies.includes(UPDATE_STORAGE_POLICY) && store.getState().auth.userType != "admin"} type="button" onClick={insertTagHandler}>
                          <div style={{ padding: "2em" }}>Aggiungi</div>
                        </Button>
                      </div>
                    </FormGroup>

                  </form>

                  <span>Seleziona tag</span><br />
                  <div style={{ width: "100%", display: "inline-flex", overflow: "auto", marginBottom: "30px", padding: "1rem 0" }}>

                    <StyledToggleButtonGroup
                      size="small"
                      type="checkbox" value={this.state.selectedTags} name="tags" defaultValue={this.state.selectedTags} onChange={handleChange}
                      aria-label="tags"
                    >
                      {this.state.tags !== undefined ?
                        this.state.tags.map(
                          (item, index) => (<ToggleButton aria-label={item} disabled={!this.props.policies.includes(UPDATE_STORAGE_POLICY) && store.getState().auth.userType != "admin"} value={item}>{item}</ToggleButton>)
                        ) : null
                      }
                      {
                        this.state.tempTags.length > 0 ?
                          this.state.tempTags.map(
                            (item, index) => (<ToggleButton aria-label={item} disabled={!this.props.policies.includes(UPDATE_STORAGE_POLICY) && store.getState().auth.userType != "admin"} value={item}>{item}</ToggleButton>)
                          )
                          : null
                      }
                    </StyledToggleButtonGroup>
                  </div>
                </div>
                : <div
                  style={{
                    padding: "32px 20px 70px 20px", display: "inline-flex",
                    verticalAlign: "center",
                  }}
                >
                  <img src={dangerImage}
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
                  }}>Cliccando su conferma verranno apportate tutte le modifiche ai Tags del gruppo! </h5>
                </div>
              }
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.props.openPopupHandler}>
            Close
          </Button>

          {this.state.activeStep === 2 ? <Button variant="secondary" onClick={this.handleOnClickBack}>Indietro</Button> : null}

          <Button disabled={!this.props.policies.includes(UPDATE_STORAGE_POLICY) && store.getState().auth.userType != "admin"} variant="primary" onClick={this.state.activeStep === steps.length ? () => { this.editStorageHandler(this.state) } : this.handleOnClickNext}>
            {this.state.activeStep === steps.length ? 'Conferma' : 'Applica Modifiche'}
          </Button>

        </DialogActions>
      </>
    )
  }
}
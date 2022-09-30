import React from 'react';

import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';


const InfoModal = ({message,buttonText,closeHandler,handler,image}) => {

    const openPopupHandler = ()=>{

    }

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
        </DialogContent>
        <DialogActions>
          <Button variant="danger" onClick={closeHandler}>
            Chiudi
          </Button>
          <Button onClick={handler}>
            {buttonText}
          </Button>

        </DialogActions>
      </>



    )

}

export default InfoModal;
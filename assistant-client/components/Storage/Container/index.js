import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import StorageCard from './StorageCard'
import { gridSpacing } from '../../../store/constant';
import { getStorage } from '../../../controllers/storageController';
import { getUserRole } from '../../../controllers/userController';

const StorageContainer = () => {

    const [isLoading, setLoading] = useState(true);
    const [Storage, setStorage] = useState([]);
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (!isLoading) return
        getStorage((result, error) => {
            if (error != null) {
                alert(error);
            } else {
                console.log("result++++++");
                console.log(result)
                setStorage(result);
                setLoading(false);
            }
        });
        getUserRole(((res, err) => {
                if (err != null)
                  alert(err)
                else
                  setPolicies(res)
              }));
    }, [isLoading]);

    const updateContent = () =>{
        setLoading(!isLoading)
    }

    if (isLoading)
        return <h1>Loading...</h1>
    else
        if (Storage != null)
            return (
                <>
                            <Grid container spacing={gridSpacing} style={{"width":"100%"}}>
                                {Storage.map((item, index) => (
                                    <Grid item lg={3} sm={6} md={6} xs={12} >
                                        <StorageCard index={index} storage={item} policies={policies} updateHandler={updateContent}/>
                                    </Grid>
                                ))}
                            </Grid>
                </>
            );

};

export default StorageContainer;

import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import VmCard from './VmCard'
import { getVms } from '../../../controllers/vmController'
import { gridSpacing } from '../../../store/constant';

// ===========================|| DEFAULT DASHBOARD ||=========================== //

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [vms, setVms] = useState([]);
    useEffect(() => {
        if (!isLoading) return
        setLoading(true);
        getVms((result, error) => {
            if (error != null) {
                alert(error);
            } else {
                console.log(result)
                setVms(result);
                setLoading(false);
            }
        });
    }, [isLoading]);

    const updateContent = ()=>{
        setLoading(!isLoading)
    }

    if (isLoading)
        return <h1>Loading...</h1>
    else
        return (
            <Grid container spacing={gridSpacing}>
                {
                    vms.map(element =>
                        <Grid item lg={3} sm={6} md={4} xs={12} >
                            <VmCard vm={element} isLoading={isLoading} updateHandler={updateContent}/>
                        </Grid>
                    )
                }
            </Grid>
        );
};

export default Dashboard;

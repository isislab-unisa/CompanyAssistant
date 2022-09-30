import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import RoleCard from './RoleCard'
import { getRoles } from '../../../controllers/roleController'
import { gridSpacing } from '../../../store/constant';

const RolesContainer = () => {
    const [isLoading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);
    useEffect(() => {
        if (!isLoading) return
        setLoading(true);
        getRoles((result, error) => {
            if (error != null) {
                alert(error);
            } else {
                console.log(result)
                setRoles(result);
                setLoading(false);
            }
        });
    }, [isLoading]);

    const updateContent = ()=>{
        setLoading(!isLoading)
    }
    if (isLoading)
        return <h1>Loading...</h1>

    return (
        <Grid container spacing={gridSpacing}>
            <Grid item >
                <Grid container spacing={gridSpacing}>
                    {roles.map((item, index) => (
                        <Grid item lg={12} md={12} sm={12} xs={12}>
                            <RoleCard index={index} role={item} updateHandler={updateContent} isLoading={isLoading} />
                        </Grid>)
                    )}
                </Grid>
            </Grid>
        </Grid>
    );
};

export default RolesContainer;

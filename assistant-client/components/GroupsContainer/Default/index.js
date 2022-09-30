import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import GroupCard from './GroupCard'
import { gridSpacing } from '../../../store/constant';
import { getGroups } from '../../../controllers/groupController';
import { getUserRole } from '../../../controllers/userController';

const GroupsContainer = () => {

    const [isLoading, setLoading] = useState(true);
    const [groups, setGroups] = useState([]);
    const [policies, setPolicies] = useState([]);

    useEffect(() => {
        if (!isLoading) return
        getGroups((result, error) => {
            if (error != null) {
                alert(error);
            } else {
                console.log(result)
                setGroups(result);
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

    const updateContent = ()=>{
        setLoading(!isLoading)
    }

    if (isLoading)
        return <h1>Loading...</h1>
    else
        if (groups != null)
            return (
                <>
                    <Grid container spacing={gridSpacing}>
                        <Grid item >
                            <Grid container spacing={gridSpacing}>
                                {groups.map((item, index) => (
                                    <Grid item lg={4} md={6} sm={6} xs={12}>
                                        <GroupCard index={index} group={item} policies={policies} updateHandler={updateContent}/>
                                    </Grid>
                                ))}
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            );

};

export default GroupsContainer;

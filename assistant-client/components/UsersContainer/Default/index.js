import React, { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@material-ui/core';

// project imports
import UserCard from './UserCard'
import { getUsers } from '../../../controllers/userController';
import { gridSpacing } from '../../../store/constant';

const UsersContainer = () => {
    const [isLoading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    useEffect(() => {
        if (!isLoading) return
        getUsers((result, error) => {
            if (error != null) {
                alert(error);
            } else {
                console.log(result)
                setUsers(result);
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
                    users.map(element =>
                        <Grid item lg={4} sm={6} md={6} xs={12} >
                            <UserCard user={element} isLoading={isLoading} updateHandler={updateContent}/>
                        </Grid>
                    )
                }
            </Grid>
        );
};

export default UsersContainer;

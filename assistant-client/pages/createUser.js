
import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import MainLayout from '../components/layout/MainLayout/index'
import { isLogged } from "../controllers/loginController"
import NavigationScroll from '../components/layout/NavigationScroll';

import config from '../utils/config'
import themes from '../themes/index';
import CreateUser from '../components/UsersContainer/CreateUser';

import { CssBaseline, StyledEngineProvider } from '@material-ui/core';
import "bootstrap/dist/css/bootstrap.min.css";
export default function NuovaHome() {

  const customization = useSelector((state) => state.customization);

  return (
  
    
    
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                   <MainLayout>
                    <CreateUser></CreateUser>
                  </MainLayout>
            </ThemeProvider>
       
    
  );

}

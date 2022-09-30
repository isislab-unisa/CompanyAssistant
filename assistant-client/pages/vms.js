
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import MainLayout from '../components/layout/MainLayout/index'
import { isLogged } from "../controllers/loginController"

import themes from '../themes/index';
import Dashboard from '../components/virtualMachines/Default';

import { CssBaseline } from '@material-ui/core';
import "bootstrap/dist/css/bootstrap.min.css";
export default function Vms() {

  const customization = useSelector((state) => state.customization);

  if (!isLogged()) {
    useEffect(() => { window.location.href = "/login"; })
    return (<></>);
  } else {
    return (
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <MainLayout>
          <Dashboard></Dashboard>
        </MainLayout>
      </ThemeProvider>
    );
  }

}

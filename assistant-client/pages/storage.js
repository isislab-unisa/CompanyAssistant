
import React  from 'react'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import "bootstrap/dist/css/bootstrap.min.css";
import MainLayout from '../components/layout/MainLayout/index'
import { isLogged } from "../controllers/loginController"
import StorageContainer from "../components/Storage/Container"
import themes from '../themes/index';
import { CssBaseline } from '@material-ui/core';
import "bootstrap/dist/css/bootstrap.min.css";

export default function Storage() {

  const customization = useSelector((state) => state.customization);


  if (!isLogged()) {
    useEffect(() => { window.location.href = "/login"; })
    return (<></>);
  }
  else {
    return (
      <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <MainLayout>
          <div style={{ padding: "0 2% 0 2%", marginBottom: "13%" }}>
            <StorageContainer  />
          </div>
        </MainLayout>
      </ThemeProvider>
    );
  }
}


import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import MainLayout from '../components/layout/MainLayout/index'
import { isLogged } from "../controllers/loginController"
import RolesContainer from "../components/RolesContainer/Default"

import themes from '../themes/index';
import { CssBaseline, StyledEngineProvider } from '@material-ui/core';
import "bootstrap/dist/css/bootstrap.min.css";

export default function Users() {

  const Header = dynamic(() => import('../components/header'));
  const Layout = dynamic(() => import('../components/layout'));
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
            <RolesContainer  />
          </div>
        </MainLayout>
      </ThemeProvider>

    );

  }
}
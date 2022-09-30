
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import { CssBaseline } from '@material-ui/core';
import MainLayout from '../components/layout/MainLayout/index'
import { ThemeProvider } from '@material-ui/core/styles';
import { isLogged } from "../controllers/loginController"
import "bootstrap/dist/css/bootstrap.min.css";
import themes from '../themes/index';
import HomeContainer from '../components/Home';
export default function Index() {

  const customization = useSelector((state) => state.customization);


  if (!isLogged()) {
    useEffect(() => { window.location.href = "/login"; })
    return (<></>);
  } else {
    return (
      <>
        <ThemeProvider theme={themes(customization)}>
        <CssBaseline />
        <MainLayout>
          <HomeContainer></HomeContainer>
        </MainLayout>
      </ThemeProvider>
      </>
    );
  }

}

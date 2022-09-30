import { useSelector } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import MainLayout from '../components/layout/MainLayout/index'
import themes from '../themes/index';
import LoginForm from '../components/Login'
import { store } from '../store';

import { CssBaseline } from '@material-ui/core';
import FullPageLayout from '../components/layout/FullPageLayout';
export default function LoginPage() {

  const customization = useSelector((state) => state.customization);

  return (
            <ThemeProvider theme={themes(customization)}>
                <CssBaseline />
                <FullPageLayout>
                    <LoginForm/>
                </FullPageLayout>
            </ThemeProvider>
  );

}

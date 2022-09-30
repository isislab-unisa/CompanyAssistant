
import '../styles/globals.css'
import '../assets/leftSettingMenu.css'
import '../assets/roles.css'
import '../assets/navBar.css'
import '../assets/cards.css'
import '../assets/table.css'
import '../assets/check.css'
import '../assets/style.scss'

import { Provider } from 'react-redux';
import {StyledEngineProvider } from '@material-ui/core';
import  store  from '../store';

export default function App({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <Component {...pageProps} />
      </StyledEngineProvider>
    </Provider>
  )
}

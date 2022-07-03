import React from 'react';
import ReactDOM from 'react-dom/client'
import App from './App';
import './GlobalStyles.css'
import { StyledEngineProvider, ThemeProvider } from '@mui/material/styles';
import mainTheme from './Themes/mainTheme';
import { Provider } from 'react-redux';
import { store } from './store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<Provider store={store}>
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={mainTheme}>
      <App/>
    </ThemeProvider>
  </StyledEngineProvider>
</Provider>);

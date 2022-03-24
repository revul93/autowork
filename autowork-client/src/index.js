import { render } from 'react-dom';
import { StrictMode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import App from './App';
import theme from './theme';

render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
  document.getElementById('root'),
);

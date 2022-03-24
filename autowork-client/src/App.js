import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Container, Typography } from '@mui/material';
import Login from './pages/Login';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route
        path={'/'}
        element={
          <>
            <Typography>Hello</Typography>
          </>
        }
      />
      <Route path={'/user/login'} element={<Login />} />
      <Route path={'/admin/login'} element={<Login />} />
    </Routes>
  </BrowserRouter>
);

export default App;

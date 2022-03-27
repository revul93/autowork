import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { login } from '../../redux';
import LoginForm from './LoginForm';
import VerificationForm from './VerificationForm';

const Login = (props) => {
  const [state, setState] = useState({
    username: 'nuraddin.alfarsi',
    password: 'Vk1AoPKo',
    user_id: '',
    auth_code: '',
    is_loading: false,
    error: false,
    errorMessage: '',
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (props.token) {
      navigate('/', { replace: true });
    }
  }, [props.token, navigate]);

  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        lg={8}
        sx={{
          backgroundImage: 'url(https://source.unsplash.com/random)',
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid
        item
        xs={12}
        sm={8}
        md={6}
        lg={4}
        component={Paper}
        elevation={6}
        square>
        <Box
          sx={{
            my: 8,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            User Login
          </Typography>
          {!state.user_id ? (
            <LoginForm state={state} setState={setState} />
          ) : (
            <VerificationForm state={state} setState={setState} login={login} />
          )}
          <Snackbar
            open={state.error}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={() =>
              setState((state) => ({
                ...state,
                error: false,
                errorMessage: '',
              }))
            }>
            <Alert
              onClose={() =>
                setState((state) => ({
                  ...state,
                  error: false,
                  errorMessage: '',
                }))
              }
              severity='error'
              sx={{ width: '100%' }}>
              {state.errorMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Grid>
    </Grid>
  );
};

const mapStateToPorps = (state) => ({
  token: state.auth.token,
});

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(login(token)),
});

export default connect(mapStateToPorps, mapDispatchToProps)(Login);

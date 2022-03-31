import { useEffect, useState } from 'react';
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
import { useForm } from 'react-hook-form';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import autowork_logo from '../../images/autowork-logo.png';

const AdminLogin = (props) => {
  const { is_logged_in, login } = props;
  const navigate = useNavigate();
  const [state, setState] = useState({
    username: '',
    password: '',
    user_id: '',
    token: null,
    is_loading: false,
    error: '',
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (state.token) {
      login(state.token);
    }

    if (is_logged_in) {
      return navigate('/');
    }
  }, [state.token, login, is_logged_in, navigate]);

  const handleLogin = async () => {
    try {
      setState((state) => ({ ...state, is_loading: true }));
      const response = await axios.post(
        '/api/auth/admin_login',
        JSON.stringify({
          username: state.username,
          password: state.password,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.status === 200) {
        setState((state) => ({
          ...state,
          token: response.data.payload.token,
        }));
      }
    } catch (error) {
      console.error(error);
      setState((state) => ({
        ...state,
        error: error.response.data.message,
      }));
    } finally {
      setState((state) => ({ ...state, is_loading: false }));
    }
  };

  return (
    <Grid container component='main' sx={{ height: '100vh' }}>
      <Grid
        item
        xs={false}
        sm={4}
        md={6}
        lg={8}
        sx={{
          backgroundImage: `url(${autowork_logo})`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light'
              ? t.palette.grey[50]
              : t.palette.grey[900],
          backgroundSize: 'center',
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
            Admin Login
          </Typography>
          <Box
            component='form'
            noValidate
            onSubmit={handleSubmit(handleLogin)}
            sx={{ mt: 1 }}>
            <TextField
              {...register('username', { required: true })}
              margin='normal'
              fullWidth
              id='username'
              label='Username'
              name='username'
              autoFocus
              value={state.username}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  username: event.target.value,
                }))
              }
              error={errors.username?.type === 'required' ? true : false}
            />
            <TextField
              {...register('password', { required: true })}
              margin='normal'
              fullWidth
              name='password'
              label='Password'
              type='password'
              id='password'
              autoComplete='current-password'
              value={state.password}
              onChange={(event) =>
                setState((state) => ({
                  ...state,
                  password: event.target.value,
                }))
              }
              error={errors.password?.type === 'required' ? true : false}
            />
            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 3, mb: 2 }}
              disabled={state.is_loading}>
              Login
            </Button>
            <Link href='#' variant='body2'>
              Forgot password?
            </Link>
          </Box>
          <Snackbar
            open={state.error ? true : false}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            onClose={() =>
              setState((state) => ({
                ...state,
                error: '',
              }))
            }>
            <Alert
              onClose={() =>
                setState((state) => ({
                  ...state,
                  error: '',
                }))
              }
              severity='error'
              sx={{ width: '100%' }}>
              {state.error}
            </Alert>
          </Snackbar>
        </Box>
      </Grid>
    </Grid>
  );
};

const mapStateToPorps = (state) => ({
  token: state.auth.token,
  is_logged_in: state.auth.is_logged_in,
});

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(login(token)),
});

export default connect(mapStateToPorps, mapDispatchToProps)(AdminLogin);

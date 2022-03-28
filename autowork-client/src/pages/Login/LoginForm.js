import { useForm } from 'react-hook-form';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const LoginForm = (props) => {
  const { state, setState } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async () => {
    try {
      setState((state) => ({ ...state, is_loading: true }));
      const response = await axios.post(
        '/api/auth/login',
        JSON.stringify({ username: state.username, password: state.password }),
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.status === 200) {
        setState((state) => ({
          ...state,
          user_id: response.data.payload.user_id,
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
          setState((state) => ({ ...state, username: event.target.value }))
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
          setState((state) => ({ ...state, password: event.target.value }))
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
  );
};

export default LoginForm;

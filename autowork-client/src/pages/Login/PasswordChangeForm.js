import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

const PasswordChangeForm = (props) => {
  const { state, setState } = props;

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handlePasswordChange = async () => {
    setState((state) => ({ ...state, is_loading: true }));
    try {
      const response = await axios.post(
        '/api/auth/reset_password',
        JSON.stringify({
          password,
          password_confirmation: passwordConfirmation,
        }),
        {
          headers: {
            'x-auth-token': state.token,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.status === 200) {
        setMessage('Password changed successfully. Redirecting ...');
        setInterval(() => {
          setState((state) => ({
            ...state,
            password_change_required: false,
          }));
        }, 3000);
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
      onSubmit={handleSubmit(handlePasswordChange)}
      sx={{ mt: 3 }}>
      <Typography variant='body2'>
        You must change your password before continue
      </Typography>
      <TextField
        {...register('password', { required: true, minLength: 8 })}
        margin='normal'
        fullWidth
        id='password'
        label='password'
        type='password'
        name='password'
        autoFocus
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        error={errors.passwprd?.type === 'required' ? true : false}
      />
      <TextField
        {...register('passwordConfirmation', {
          required: true,
          value: (value) => value === password || "Passwords don't match",
        })}
        margin='normal'
        fullWidth
        name='passwordConfirmation'
        label='Confirm your password'
        type='password'
        id='passwordConfirmation'
        value={passwordConfirmation}
        onChange={(event) => setPasswordConfirmation(event.target.value)}
        error={errors.passwordConfirmation ? true : false}
      />
      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={state.is_loading}>
        Submit
      </Button>
      <Snackbar
        open={message ? true : false}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => {
          setMessage('');
        }}>
        <Alert
          onClose={() => {
            setMessage('');
          }}
          severity='info'
          sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PasswordChangeForm;

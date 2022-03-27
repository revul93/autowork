import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Box from '@mui/material/Box';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const VerificationForm = (props) => {
  const { state, setState, login } = props;

  const RESEND_CODE_INTERVAL = 10;
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(RESEND_CODE_INTERVAL);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (!resendTimer) {
      setCanResend(true);
      return;
    }
    const timeer_interval = setInterval(() => {
      setResendTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(timeer_interval);
    };
  }, [resendTimer]);

  const formateTime = (seconds) =>
    (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ':' : ':0') + seconds;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleVerification = async () => {
    try {
      setState((state) => ({ ...state, is_loading: true }));
      const response = await axios.post(
        '/api/auth/verify_login',
        JSON.stringify({ user_id: state.user_id, auth_code: state.auth_code }),
        { headers: { 'Content-Type': 'application/json' } },
      );

      if (response.status === 200) {
        sessionStorage.setItem('x-auth-token', response.data.payload.token);
        login(response.data.payload.token);
        setState((state) => ({
          ...state,
        }));
      } else {
      }
    } catch (error) {
      console.error(error);
      setState((state) => ({
        ...state,
        error: true,
        errorMessage: error.response.data.message,
      }));
    } finally {
      setState((state) => ({ ...state, is_loading: false }));
    }
  };

  const ResendAuthCode = async () => {
    try {
      const response = await axios.post(
        '/api/auth/login',
        JSON.stringify({
          username: state.username,
          password: state.password,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 200) {
        setMessage('Another code is sent to your email');
        setShowMessage(true);
      }
    } catch (error) {
      console.error(error);
      setState((state) => ({
        ...state,
        error: true,
        errorMessage: 'Server failed sending code',
      }));
    } finally {
      setCanResend(false);
      setResendTimer(RESEND_CODE_INTERVAL);
    }
  };

  return (
    <Box
      component='form'
      noValidate
      onSubmit={handleSubmit(handleVerification)}
      sx={{ mt: 7 }}>
      <FormLabel>Enter verification code sent to your email</FormLabel>
      <TextField
        {...register('auth_code', { required: true })}
        margin='normal'
        fullWidth
        id='auth_code'
        label='Authentication Code'
        name='auth_code'
        autoFocus
        value={state.auth_code}
        onChange={(event) =>
          setState((state) => ({ ...state, auth_code: event.target.value }))
        }
        error={errors.auth_code?.type === 'required' ? true : false}
      />
      <Button
        fullWidth
        variant='text'
        sx={{ mt: 3, mb: 2 }}
        disabled={!canResend}
        onClick={ResendAuthCode}>
        {canResend
          ? `Resend code`
          : `Please wait for ${formateTime(
              resendTimer,
            )} before requesting new code`}
      </Button>
      <Button
        type='submit'
        fullWidth
        variant='contained'
        sx={{ mt: 3, mb: 2 }}
        disabled={state.is_loading}>
        Submit
      </Button>
      <Snackbar
        open={showMessage}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        onClose={() => {
          setMessage('');
          setShowMessage(false);
        }}>
        <Alert
          onClose={() => {
            setMessage('');
            setShowMessage(false);
          }}
          severity='info'
          sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerificationForm;

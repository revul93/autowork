import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../images/logo.png';
import loading_button from '../images/loading-button.gif';
import { login, logout } from '../redux';
const LOGIN_API = '/api/auth/login';
const LOGIN_VERIFY_API = '/api/auth/verify_login';

const Login = (props) => {
  const {
    register: registerAuth,
    handleSubmit: handleSubmitAuth,
    formState: { errors: errorsAuth },
  } = useForm();
  const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    formState: { errors: errorsVerify },
  } = useForm();
  const RESEND_CODE_INTERVAL = 300;
  const [state, setState] = useState({
    username: 'shamil.ahmed',
    password: 'qX32Dn55',
    user_id: '',
    message: '',
    message_style: '',
    auth_code: '',
    resend_code_time: RESEND_CODE_INTERVAL,
    login_loding: false,
    is_authenticated: false,
  });
  const navigate = useNavigate();

  const showMessage = async (msg, style) => {
    setState((state) => ({
      ...state,
      message_style: style,
      message: msg,
    }));
    setTimeout(() => {
      setState((state) => ({
        ...state,
        message_style: '',
        message: '',
      }));
    }, 5000);
  };

  const handleAuthentication = async () => {
    try {
      setState((state) => ({ ...state, login_loding: true }));
      const response = await axios.post(
        LOGIN_API,
        JSON.stringify({ username: state.username, password: state.password }),
        { headers: { 'Content-Type': 'application/json' } },
      );

      response.status === 200
        ? setState((state) => ({
            ...state,
            user_id: response.data.payload.user_id,
            is_authenticated: true,
          }))
        : setState((state) => ({ ...state, message: 'Login failed' }));
    } catch (error) {
      console.error(error);
      showMessage(error.response.data.message, 'text-danger');
    } finally {
      setState((state) => ({ ...state, login_loding: false }));
    }
  };

  const handleVerification = async () => {
    try {
      setState((state) => ({ ...state, login_loding: true }));
      const response = await axios.post(
        LOGIN_VERIFY_API,
        JSON.stringify({ user_id: state.user_id, auth_code: state.auth_code }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      if (response.status === 200) {
        sessionStorage.setItem('x-auth-token', response.data.payload.token);
        props.login(response.data.payload.token);
        navigate('/home', { replace: true });
      } else {
        setState((state) => ({ ...state, message: 'Login failed' }));
      }
    } catch (error) {
      console.error(error);
      showMessage(error.response.data.message, 'text-danger');
    } finally {
      setState((state) => ({ ...state, login_loding: false }));
    }
  };

  useEffect(() => {
    let timer_interval;
    if (state.is_authenticated) {
      if (!timer_interval) {
        timer_interval = setInterval(() => {
          state.resend_code_time > 0 &&
            setState((state) => ({
              ...state,
              resend_code_time: state.resend_code_time - 1,
            }));
        }, 1000);
      }
    } else {
      timer_interval && clearInterval(timer_interval);
    }
    return () => clearInterval(timer_interval);
  }, [state]);

  const requestAuthCode = async () => {
    if (state.is_authenticated) {
      try {
        const response = await axios.post(
          LOGIN_API,
          JSON.stringify({
            username: state.username,
            password: state.password,
          }),
          { headers: { 'Content-Type': 'application/json' } },
        );
        response.status === 200 &&
          showMessage('Code sent to your email', 'text-success');
      } catch (error) {
        console.error(error);
        showMessage('Server failed sending code', 'text-danger');
      } finally {
        setState((state) => ({
          ...state,
          resend_code_time: RESEND_CODE_INTERVAL,
        }));
      }
    }
  };

  const formateTime = (seconds) =>
    (seconds - (seconds %= 60)) / 60 + (9 < seconds ? ':' : ':0') + seconds;

  const AuthenticationForm = (
    <form
      className='rounded border p-4 col-12 col-sm-6 mx-auto d-block m-5'
      onSubmit={handleSubmitAuth(handleAuthentication)}>
      <div className='form-group m-1'>
        <label htmlFor='username_input'>Username</label>
        <input
          {...registerAuth('username', { required: true })}
          className='form-control'
          id='username_input'
          type='text'
          name='username'
          value={state.username}
          autoComplete='false'
          autoFocus={true}
          onChange={(event) =>
            setState((state) => ({ ...state, username: event.target.value }))
          }
        />
        {errorsAuth.username?.type === 'required' && (
          <span className='text-danger'>Username is required</span>
        )}
      </div>
      <div className='form-group m-1'>
        <label htmlFor='password_input'>Password</label>
        <input
          {...registerAuth('password', { required: true })}
          className='form-control'
          id='password_input'
          type='password'
          name='password'
          value={state.password}
          onChange={(event) =>
            setState((state) => ({ ...state, password: event.target.value }))
          }
        />
        {errorsAuth.password?.type === 'required' && (
          <span className='text-danger'>Password is required</span>
        )}
      </div>
      {state.login_loding ? (
        <img
          className='d-block mx-auto my-3 text-center'
          alt=''
          src={loading_button}
        />
      ) : (
        <input
          className='d-block mx-auto my-3 btn btn-primary'
          type='submit'
          value='Login'
        />
      )}
      <p className={`${state.message_style} text-center`}>{state.message}</p>
      <a className='text-decoration-none' href='?'>
        Forget Password ?
      </a>
    </form>
  );

  const VerificationForm = (
    <form
      className='rounded border p-4 col-12 col-sm-6 mx-auto d-block m-5'
      onSubmit={handleSubmitVerify(handleVerification)}>
      <p className='form-group fs-6 m-2'>
        Enter authentication code that sent to your email
        <br />
        <span className='fst-italic d-block m-1'>
          Didn't recieve code?{' '}
          {state.resend_code_time === 0 ? (
            <span
              style={{ cursor: 'pointer', color: 'blue' }}
              onClick={() => requestAuthCode()}>
              Resend Code
            </span>
          ) : (
            `Resend code in ${formateTime(state.resend_code_time)}`
          )}
        </span>
      </p>
      <div className='form-group m-1'>
        <label htmlFor='auth_code_input'>Authentication Code</label>
        <input
          {...registerVerify('auth_code', {
            required: true,
          })}
          className='form-control'
          id='auth_code_input'
          type='text'
          name='auth_code'
          value={state.auth_code}
          onChange={(event) =>
            setState((state) => ({ ...state, auth_code: event.target.value }))
          }
        />
        {errorsVerify.auth_code?.type === 'required' && (
          <span className='text-danger'>Invalid authentication code</span>
        )}
      </div>
      {state.login_loding ? (
        <img
          className='d-block mx-auto my-3 text-center'
          alt=''
          src={loading_button}
        />
      ) : (
        <input
          className='d-block mx-auto my-3 btn btn-primary'
          type='submit'
          value='Verify'
        />
      )}
      <p className={`${state.message_style} text-center`}>{state.message}</p>
    </form>
  );

  return (
    <>
      <img
        className='img-fluid mx-auto d-block align-middle'
        alt='autowork logo'
        src={logo}
      />
      {!state.is_authenticated ? AuthenticationForm : VerificationForm}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  login: (token) => dispatch(login(token)),
  logout: () => dispatch(logout()),
});

export default connect(null, mapDispatchToProps)(Login);

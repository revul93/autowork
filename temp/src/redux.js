import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import jwtDecode from 'jwt-decode';
const ACTIONTYPES = { LOGIN: 'LOGIN', LOGOUT: 'LOGOUT' };

let token = sessionStorage.getItem('x-auth-token');
let user_id = null;
let employee_id = null;
let role_id = null;
let employee_name = '';
let role_title = '';
let is_logged_in = false;
if (token) {
  const decoded_token = jwtDecode(token);
  if (Date.now() <= decoded_token.exp * 1000) {
    user_id = decoded_token.user_id;
    employee_id = decoded_token.employee_id;
    role_id = decoded_token.role_id;
    employee_name = decoded_token.employee_name;
    role_title = decoded_token.role_title;
    is_logged_in = true;
  }
}

const initial_state = {
  token,
  user_id,
  employee_id,
  role_id,
  is_logged_in,
  employee_name,
  role_title,
};

export const login = (token) => ({
  type: ACTIONTYPES.LOGIN,
  payload: { token },
});

export const logout = () => ({
  type: ACTIONTYPES.LOGOUT,
});

const authReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ACTIONTYPES.LOGIN:
      sessionStorage.setItem('x-auth-token', action.payload.token);
      const decoded_token = jwtDecode(action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        user_id: decoded_token.user_id,
        employee_id: decoded_token.employee_id,
        role_id: decoded_token.role_id,
        employee_name: decoded_token.employee_name,
        role_title: decoded_token.role_title,
        is_logged_in: true,
      };
    case ACTIONTYPES.LOGOUT:
      sessionStorage.removeItem('x-auth-token');
      return {
        ...state,
        token: null,
        user_id: null,
        employee_id: null,
        role_id: null,
        employee_name: '',
        role_title: '',
        is_logged_in: false,
      };
    default:
      return state;
  }
};

export const store = createStore(
  combineReducers({ auth: authReducer }),
  composeWithDevTools(applyMiddleware(thunk)),
);

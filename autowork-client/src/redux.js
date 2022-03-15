import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import jwt from 'jsonwebtoken';
const ACTIONTYPES = { LOGIN: 'LOGIN', LOGOUT: 'LOGOUT' };

let token = sessionStorage.getItem('x-access-token');
let user_id = null;
let is_logged_in = fakse;
if (token) {
  const decoded_token = jwt.decode(token);
  if (Date.now() >= decoded_token.exp * 1000) {
    user_id = null;
    is_logged_in = false;
  } else {
    user_id = decoded_token.user_id;
    is_logged_in = true;
  }
}

const initial_state = { token, user_id, is_logged_in };

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
      sessionStorage.setItem('x-access-token', action.payload.token);
      return {
        ...state,
        token: sessionStorage.getItem('x-access-token'),
        user_id: jwt.decode(sessionStorage.getItem('x-access-token')).user_id,
        is_logged_in: true,
      };
    case ACTIONTYPES.LOGOUT:
      sessionStorage.removeItem('x-access-token');
      return {
        ...state,
        token: null,
        user_id: null,
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

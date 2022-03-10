import { composeWithDevTools } from 'redux-devtools-extension';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
const ACTIONTYPES = { LOGIN: 'LOGIN', LOGOUT: 'LOGOUT' };

const initial_state = {
  token: sessionStorage.getItem('x-access-token'),
};

export const login = (token) => ({
  type: ACTIONTYPES.LOGIN,
  payload: { token },
});

export const logout = () => ({
  type: ACTIONTYPES.LOGOUT,
});

export const authReducer = (state = initial_state, action) => {
  switch (action.type) {
    case ACTIONTYPES.LOGIN:
      sessionStorage.setItem('x-access-token', action.payload.token);
      return {
        ...state,
        token: sessionStorage.getItem('x-access-token'),
      };
    case ACTIONTYPES.LOGOUT:
      sessionStorage.removeItem('x-access-token');
      return {
        ...state,
        token: null,
      };
    default:
      return state;
  }
};

export const store = createStore(
  combineReducers({ auth: authReducer }),
  composeWithDevTools(applyMiddleware(thunk)),
);

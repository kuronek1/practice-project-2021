import CONSTANTS from '../../constants';
import http from '../interceptor';
import store from '../../store';
import { clearUserStore } from '../../actions/actionCreator';

export const registerRequest = async (data) => {
  const response = await http.post('registration', data);
  return response.data.data;
};
export const loginRequest = async (data) => {
  const response = await http.post('login', data);
  return response.data.data;
};
export const resfreshToken = async (data) => {
  const response = await http.patch('refresh', data);
  return response.data.data;
};

export const saveTokenPair = ({ accessToken, refreshToken }) => {
  window.localStorage.setItem(CONSTANTS.ACCESS_TOKEN, accessToken);
  window.localStorage.setItem(CONSTANTS.REFRESH_TOKEN, refreshToken);
};

export const logoutUser = (history) => {
  window.localStorage.removeItem(CONSTANTS.ACCESS_TOKEN);
  window.localStorage.removeItem(CONSTANTS.REFRESH_TOKEN);
  history.replace('/login');
  store.dispatch(clearUserStore());
};

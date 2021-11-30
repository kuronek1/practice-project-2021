import axios from 'axios';
import CONTANTS from '../constants';
import history from '../browserHistory';

const instance = axios.create({
  baseURL: CONTANTS.BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem(CONTANTS.ACCESS_TOKEN);

    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  },
  (err) => Promise.reject(err)
);

instance.interceptors.response.use(
  (response) => {
    if (response.data.tokenPair) {
      window.localStorage.setItem(
        CONTANTS.ACCESS_TOKEN,
        response.data.tokenPair.accessToken
      );
      window.localStorage.setItem(
        CONTANTS.REFRESH_TOKEN,
        response.data.tokenPair.refreshToken
      );
    }
    return response;
  },
  (err) => {
    // access token expired
    if (
      err.response.status === 408 &&
      history.location.pathname !== '/login' &&
      history.location.pathname !== '/registration' &&
      history.location.pathname !== '/'
    ) {
      console.log('not authorized');
      /* TODO send refresh tokens request */
    }

    // refresh token expired
    if (
      err.response.status === 419 &&
      history.location.pathname !== '/login' &&
      history.location.pathname !== '/registration' &&
      history.location.pathname !== '/'
    ) {
      window.localStorage.removeItem(CONTANTS.ACCESS_TOKEN);
      window.localStorage.removeItem(CONTANTS.REFRESH_TOKEN);
      history.replace('/login');
    }
    return Promise.reject(err);
  }
);

export default instance;

import axios from 'axios';
import CONSTANTS from '../constants';
import history from '../browserHistory';
import * as authController from './rest/authContoller';

const instance = axios.create({
  baseURL: CONSTANTS.BASE_URL,
});

instance.interceptors.request.use(
  (config) => {
    const accessToken = window.localStorage.getItem(CONSTANTS.ACCESS_TOKEN);

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
      authController.saveTokenPair(response.data.tokenPair);
    }

    return response;
  },
  async (err) => {
    // access token expired
    if (
      err.response.status === 403 &&
      history.location.pathname !== '/login' &&
      history.location.pathname !== '/registration' &&
      history.location.pathname !== '/'
    ) {
      // send refresh tokens request
      const refreshToken = localStorage.getItem(CONSTANTS.REFRESH_TOKEN);
      if (!refreshToken) {
        authController.logoutUser();
        return Promise.reject(err);
      }

      try {
        const response = await authController.resfreshToken({ refreshToken });
        authController.saveTokenPair(response.data.tokenPair);

        // do initial request
        instance.request(err.config);
        return;
      } catch (error) {
        // refresh token expired
        if (
          err.response.status === 419 &&
          history.location.pathname !== '/login' &&
          history.location.pathname !== '/registration' &&
          history.location.pathname !== '/'
        ) {
          /* TODO check saga remove user data */

          authController.logoutUser();
        }
      }
    }

    return Promise.reject(err);
  }
);

export default instance;

import axios from 'axios';
import store from '../store';
import { SET_MESSAGE } from '@/store/mutations';

const service = axios.create({
  baseURL:
    process.env.NODE_ENV === 'production'
      ? // @ts-ignore
        window.DOMAIN
      : 'http://localhost:3000/api',
  timeout: 10000,
});

service.interceptors.request.use(
  (config) => {
    if (store.state.auth.token) {
      config.headers.Authorization = `Bearer ${store.state.auth.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => response,
  (error) => {
    let msg = error.response
      ? error.response.data.message
      : 'An unrecognized error has occurred';

    let heading = error.response
      ? error.response.data.error
      : 'Something went wrong...';

    if (msg === 'Unauthorized') {
      heading = msg;
      msg = 'Please login first';
    }

    store.commit(SET_MESSAGE, {
      title: heading,
      text: msg,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

export default service;

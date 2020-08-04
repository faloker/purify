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
  config => {
    if (store.state.auth.token) {
      config.headers.Authorization = `Bearer ${store.state.auth.token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  response => response,
  error => {
    const msg = error.response
      ? error.response.data.message
      : 'Something went wrong...';

    store.commit(SET_MESSAGE, {
      text: msg,
      title: error.response.data.error,
      type: 'error',
    });
    return Promise.reject(error);
  }
);

export default service;

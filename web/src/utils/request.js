import axios from 'axios';
import Vue from 'vue';
import store from '../store';

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? window.DOMAIN : 'http://localhost:3000/api',
  timeout: 5000,
});

service.interceptors.request.use(
  (config) => {
    if (store.getters.token) {
      // eslint-disable-next-line no-param-reassign
      config.headers.Authorization = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => response,
  (error) => {
    Vue.toasted.global.api_error(error);
    return Promise.reject(error);
  }
);

export default service;

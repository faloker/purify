import request from '@/utils/request';

export const login = async (data) =>
  request({
    url: 'auth',
    method: 'post',
    data,
  });

export const signup = (data) =>
  request({
    url: 'auth/signup',
    method: 'post',
    data,
  });

export const refreshToken = () =>
  request({
    url: 'auth/refresh_token',
    method: 'get',
    withCredentials: true,
  });

export const logout = () =>
  request({
    url: 'auth',
    method: 'delete',
  });

export const initSAML = () =>
  request({
    url: 'auth/saml',
    method: 'get',
  });

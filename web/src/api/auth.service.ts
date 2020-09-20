import request from '@/utils/request';

export const login = (data: any) =>
  request({
    url: 'auth',
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

export function changePassword(payload: any) {
  return request({
    url: 'auth/change_password',
    method: 'post',
    data: payload,
  });
}

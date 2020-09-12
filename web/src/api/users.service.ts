import request from '@/utils/request';
import { UserSelfChange } from '@/store/types';

export function currentUser() {
  return request({
    url: 'whoami',
    method: 'get',
  });
}
export function getRecentProjects() {
  return request({
    url: 'whoami/recent_projects',
    method: 'get',
  });
}

export function changeWhoami(params: UserSelfChange) {
  return request({
    url: 'whoami',
    method: 'patch',
    data: params,
  });
}

export function getAccessTokens() {
  return request({
    url: 'whoami/tokens',
    method: 'get',
  });
}

export function createAccessToken(name: string) {
  return request({
    url: 'whoami/tokens',
    method: 'post',
    data: { name },
  });
}

export function deleteAccessToken(_id: string) {
  return request({
    url: 'whoami/tokens',
    method: 'delete',
    data: { _id },
  });
}

export function getUsers() {
  return request({
    url: 'users',
    method: 'get',
  });
}

export function createUser(user: any) {
  return request({
    url: 'users',
    method: 'post',
    data: user,
  });
}

export function editUser(userId: string, user: any) {
  return request({
    url: `users/${userId}`,
    method: 'patch',
    data: user,
  });
}

export function deleteUser(userId: string) {
  return request({
    url: `users/${userId}`,
    method: 'delete',
  });
}

export function resetUserPassword(userId: string) {
  return request({
    url: `users/${userId}/reset_password`,
    method: 'POST',
  });
}

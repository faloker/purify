import request from '@/utils/request';
import { UserSelfChange } from '@/store/types';

export function currentUser() {
  return request({
    url: 'users/whoami',
    method: 'get',
  });
}

export function changeWhoami(params: UserSelfChange) {
  return request({
    url: 'users/whoami',
    method: 'patch',
    data: params,
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

import request from '@/utils/request';

export const currentUser = async () =>
  request({
    url: 'users/current_user',
    method: 'get',
  });

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

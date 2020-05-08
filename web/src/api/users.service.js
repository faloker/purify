import request from '@/utils/request';

export const currentUser = async () =>
  request({
    url: 'users/current_user',
    method: 'get',
  });

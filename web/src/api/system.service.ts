import request from '@/utils/request';

export const getSystemConfig = () =>
  request({
    url: 'system/setup',
    method: 'get',
  });

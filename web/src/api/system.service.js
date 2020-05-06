import request from '@/utils/request';

export const getSystemSetup = () => request({
  url: 'system/setup',
  method: 'get',
});

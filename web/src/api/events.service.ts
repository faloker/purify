import request from '@/utils/request';

export function getEvents(days: number) {
  return request({
    url: `events`,
    method: 'get',
    params: { days },
  });
}

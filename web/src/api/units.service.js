import request from '@/utils/request';

export const getUnits = (project) =>
  request({
    url: 'units',
    method: 'get',
    params: { project },
  });

export const createUnit = (data) =>
  request({
    url: 'units',
    method: 'post',
    data,
  });

export const deleteUnit = (id) =>
  request({
    url: `units/${id}`,
    method: 'delete',
  });

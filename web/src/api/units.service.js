import request from '@/utils/request';

export const getUnits = (project) =>
  request({
    url: `projects/${project}/units`,
    method: 'get',
  });

export const createUnit = (data) =>
  request({
    url: 'units',
    method: 'post',
    data,
  });

export const deleteUnit = (slug) =>
  request({
    url: `units/${slug}`,
    method: 'delete',
  });

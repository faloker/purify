import request from '@/utils/request';

export const getUnits = (slug: string) =>
  request({
    url: `projects/${slug}/units`,
    method: 'get',
  });

export const createUnit = (name: string, project: string) =>
  request({
    url: 'units',
    method: 'post',
    data: { name, project },
  });

export const deleteUnit = (slug: string) =>
  request({
    url: `units/${slug}`,
    method: 'delete',
  });

export const editUnit = (slug: string, name: string) =>
  request({
    url: `units/${slug}`,
    method: 'patch',
    data: { name },
  });

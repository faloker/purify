import request from '@/utils/request';

export const getUnits = (slug: string) =>
  request({
    url: `projects/${slug}/units`,
    method: 'get',
  });

export const createUnit = (displayName: string, projectName: string) =>
  request({
    url: `projects/${projectName}/units`,
    method: 'post',
    data: { displayName },
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

import request from '@/utils/request';

export const getProjects = () =>
  request({
    url: 'projects',
    method: 'get',
  });

export const getStats = (slug) =>
  request({
    url: `projects/${slug}/stats`,
    method: 'get',
  });

export const createProject = (data) =>
  request({
    url: 'projects',
    method: 'post',
    data,
  });

export const deleteProject = (slug) =>
  request({
    url: `projects/${slug}`,
    method: 'delete',
  });

export const editProject = (slug, change) =>
  request({
    url: `projects/${slug}`,
    method: 'patch',
    data: change,
  });

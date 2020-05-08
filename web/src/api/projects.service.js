import request from '@/utils/request';

export const getProjects = () =>
  request({
    url: 'projects',
    method: 'get',
  });

export const getStats = (project) =>
  request({
    url: 'projects/stats',
    method: 'get',
    params: { project },
  });

export const createProject = (data) =>
  request({
    url: 'projects',
    method: 'post',
    data,
  });

export const deleteProject = (id) =>
  request({
    url: `projects/${id}`,
    method: 'delete',
  });

export const editProject = (id, change) =>
  request({
    url: `projects/${id}`,
    method: 'patch',
    data: change,
  });

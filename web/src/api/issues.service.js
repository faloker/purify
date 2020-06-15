import request from '@/utils/request';

export const getIssues = (unit) =>
  request({
    url: 'issues',
    method: 'get',
    params: { unit },
  });

export const updateIssues = (data) =>
  request({
    url: 'issues',
    method: 'patch',
    data,
  });

export const createTicket = (id, data) =>
  request({
    url: `issues/${id}/ticket`,
    method: 'post',
    data,
  });

export const postComment = (id, comment) =>
  request({
    url: `issues/${id}/comment`,
    method: 'post',
    data: comment,
  });

export const getComments = (issueId) =>
  request({
    url: `issues/${issueId}/comments`,
    method: 'get',
  });

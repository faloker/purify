import request from '@/utils/request';

export const getIssues = (unit: string) =>
  request({
    url: 'issues',
    method: 'get',
    params: { unit },
  });

export const updateIssues = (ids: string[], change: any) =>
  request({
    url: 'issues',
    method: 'patch',
    data: { ids, change },
  });

export const createTicket = (issuesId: string, data: any) =>
  request({
    url: `issues/${issuesId}/ticket`,
    method: 'post',
    data,
  });

export const postComment = (issuesId: string, comment: any) =>
  request({
    url: `issues/${issuesId}/comments`,
    method: 'post',
    data: comment,
  });

export const getComments = (issueId: string) =>
  request({
    url: `issues/${issueId}/comments`,
    method: 'get',
  });

import request from '@/utils/request';

export const createTemplate = (data) =>
  request({
    url: 'templates',
    method: 'post',
    data,
  });

export const getTemplates = () =>
  request({
    url: 'templates',
    method: 'get',
  });

export const deleteTemplate = (slug) =>
  request({
    url: `templates/${slug}`,
    method: 'delete',
  });

export const editTemplate = (slug, template) =>
  request({
    url: `templates/${slug}`,
    method: 'patch',
    data: template,
  });

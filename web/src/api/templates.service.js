import request from '@/utils/request';

export const createTemplate = data => request({
  url: 'templates',
  method: 'post',
  data,
});

export const getTemplates = () => request({
  url: 'templates',
  method: 'get',
});

export const deleteTemplate = id => request({
  url: `templates/${id}`,
  method: 'delete',
});

export const editTemplate = (id, template) => request({
  url: `templates/${id}`,
  method: 'patch',
  data: template,
});

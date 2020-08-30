import request from '@/utils/request';
import { Template } from '@/store/types';

export const createTemplate = (template: Template) =>
  request({
    url: 'templates',
    method: 'post',
    data: template,
  });

export const getTemplates = (verbose: boolean) =>
  request({
    url: 'templates',
    method: 'get',
    params: { verbose },
  });

export const deleteTemplate = (slug: string) =>
  request({
    url: `templates/${slug}`,
    method: 'delete',
  });

export const editTemplate = (slug: string, template: Template) =>
  request({
    url: `templates/${slug}`,
    method: 'patch',
    data: template,
  });

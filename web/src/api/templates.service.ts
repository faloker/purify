import request from '@/utils/request';
import { ApplyTemplateDto, Template } from '@/store/types';

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

export function applyTemplate(applyTemplateDto: ApplyTemplateDto) {
  return request({
    url: `reports/${applyTemplateDto.reportId}/template`,
    method: 'patch',
    data: { templateName: applyTemplateDto.templateName },
  });
}

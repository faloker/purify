import request from '@/utils/request';
import { CreateProjectDto } from '@/store/types';

export const getProjects = (verbose: boolean) =>
  request({
    url: `projects?verbose=${verbose}`,
    method: 'get',
  });

export const getStats = (slug: string) =>
  request({
    url: `projects/${slug}/stats`,
    method: 'get',
  });

export const createProject = (project: CreateProjectDto) =>
  request({
    url: 'projects',
    method: 'post',
    data: project,
  });

export const deleteProject = (slug: string) =>
  request({
    url: `projects/${slug}`,
    method: 'delete',
  });

export const editProject = (slug: string, change: CreateProjectDto) =>
  request({
    url: `projects/${slug}`,
    method: 'patch',
    data: change,
  });

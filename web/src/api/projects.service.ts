import request from '@/utils/request';
import { CreateProjectDto, AddUserDto } from '@/store/types';

export const getProjects = (verbose: boolean) =>
  request({
    url: `projects`,
    method: 'get',
    params: { verbose },
  });

export const getStats = (projectName: string) =>
  request({
    url: `projects/${projectName}/stats`,
    method: 'get',
  });

export const createProject = (project: CreateProjectDto) =>
  request({
    url: 'projects',
    method: 'post',
    data: project,
  });

export function deleteProject(projectName: string) {
  return request({
    url: `projects/${projectName}`,
    method: 'delete',
  });
}

export const editProject = (projectName: string, change: CreateProjectDto) =>
  request({
    url: `projects/${projectName}`,
    method: 'patch',
    data: change,
  });

export function getUsers(projectName: string) {
  return request({
    url: `projects/${projectName}/users`,
    method: 'get',
  });
}

export function addUser(payload: AddUserDto) {
  return request({
    url: `projects/${payload.projectName}/users`,
    method: 'post',
    data: { userId: payload.userId },
  });
}

export function removeUser(payload: AddUserDto) {
  return request({
    url: `projects/${payload.projectName}/users`,
    method: 'delete',
    data: { userId: payload.userId },
  });
}

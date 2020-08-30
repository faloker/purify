import request from '@/utils/request';
import { EditUnitDto } from '@/store/types';

export function getUnits(projectName: string) {
  return request({
    url: `projects/${projectName}/units`,
    method: 'get',
  });
}

export function createUnit(projectName: string, payload: any) {
  return request({
    url: `projects/${projectName}/units`,
    method: 'post',
    data: { ...payload },
  });
}

export function deleteUnit(unitName: string) {
  return request({
    url: `units/${unitName}`,
    method: 'delete',
  });
}

export function editUnit(unitName: string, displayName: string) {
  return request({
    url: `units/${unitName}`,
    method: 'patch',
    data: { displayName },
  });
}

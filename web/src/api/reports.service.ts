import request from '@/utils/request';

export const getReports = (unit: string) =>
  request({
    url: 'reports',
    method: 'get',
    params: { unit },
  });

export const deleteReport = (id: string) =>
  request({
    url: `reports/${id}`,
    method: 'delete',
  });

export const getReportContent = (id: string) =>
  request({
    url: `reports/${id}/content`,
    method: 'get',
  });

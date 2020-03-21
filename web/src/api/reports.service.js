import request from '@/utils/request';

export const getReports = unit => request({
  url: 'reports',
  method: 'get',
  params: { unit },
});

export const deleteReport = id => request({
  url: `reports/${id}`,
  method: 'delete',
});

export const getReportContent = id => request({
  url: `reports/${id}/content`,
  method: 'get',
});

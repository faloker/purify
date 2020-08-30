import request from '@/utils/request';

export function getReports(unitName: string) {
  return request({
    url: `units/${unitName}/reports`,
    method: 'get',
  });
}

export function deleteReport(reportId: string) {
  return request({
    url: `reports/${reportId}`,
    method: 'delete',
  });
}

export function getReportContent(reportId: string) {
  return request({
    url: `reports/${reportId}/content`,
    method: 'get',
  });
}

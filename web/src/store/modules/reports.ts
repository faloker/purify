import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getReports,
  deleteReport,
  getReportContent,
} from '@/api/reports.service';
import { FETCH_REPORTS, REPORT_DELETE, FETCH_CONTENT } from '../actions';
import { SET_REPORTS, SET_CONTENT } from '../mutations';
import { Report, Template } from '../types';

@Module
export default class Reports extends VuexModule {
  items: Report[] = [];
  content: any = {};

  @Mutation
  [SET_REPORTS](reports: Report[]) {
    this.items = reports;
  }

  @Mutation
  [SET_CONTENT](content: any) {
    this.content = content;
  }

  @Action
  async [FETCH_REPORTS](unitSlug: string) {
    const { data } = await getReports(unitSlug);
    this.context.commit(SET_REPORTS, data);
  }

  @Action
  async [REPORT_DELETE](reportId: string) {
    await deleteReport(reportId);
  }

  @Action
  async [FETCH_CONTENT](reportId: string) {
    const { data } = await getReportContent(reportId);
    this.context.commit(SET_CONTENT, data);
  }
}

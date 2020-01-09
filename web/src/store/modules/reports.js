/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-shadow */
import {
  ReportsService,
  TemplatesService,
  UnitsService,
} from '@/common/api.service';
import {
  FETCH_REPORTS,
  REPORT_DELETE,
  SAVE_TEMPLATE,
  FETCH_CONTENT,
  FETCH_TEMPLATES_NAMES,
} from '../actions';
import {
  SET_REPORTS,
  SET_CONTENT,
  SET_TEMLATES_NAMES,
} from '../mutations';

const state = {
  reports: [],
  templatesNamesAndTags: {
    tags: [],
    names: [],
  },
  content: {},
};

const getters = {
  allReports(state) {
    return state.reports;
  },
  templatesNamesAndTags(state) {
    return state.templatesNamesAndTags;
  },
  reportContent(state) {
    return state.content;
  },
};

const actions = {
  async [FETCH_REPORTS]({ commit }, unitSlug) {
    const { data } = await ReportsService.fetchReportsByUnit(unitSlug);
    commit(SET_REPORTS, data);
  },
  async [REPORT_DELETE]({ dispatch }, id) {
    await ReportsService.deleteReport(id);
  },
  async [SAVE_TEMPLATE](context, payload) {
    await TemplatesService.addTemplate(payload);
    context.dispatch(FETCH_REPORTS, payload.slug);
  },
  async [FETCH_TEMPLATES_NAMES]({ commit }) {
    const { data } = await TemplatesService.fetchNames();
    commit(SET_TEMLATES_NAMES, data);
  },

  async [FETCH_CONTENT]({ commit }, reportId) {
    const { data } = await ReportsService.getContent(reportId);
    commit(SET_CONTENT, data);
  },
};

const mutations = {
  [SET_REPORTS](state, reports) {
    state.reports = reports;
  },

  [SET_CONTENT](state, content) {
    state.content = content;
  },

  [SET_TEMLATES_NAMES](state, body) {
    state.templatesNamesAndTags.names = body.names;
    state.templatesNamesAndTags.tags = body.tags;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

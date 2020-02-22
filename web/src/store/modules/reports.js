/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-shadow */
import {
  ReportsService,
  TemplatesService,
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
  templatesNamesAndTags(state) {
    return state.templatesNamesAndTags;
  },
  reportContent(state) {
    return state.content;
  },
};

const actions = {
  async [FETCH_REPORTS]({ commit }, unit) {
    const { data } = await ReportsService.fetchReportsByUnit(unit);
    commit(SET_REPORTS, data);
  },

  async [REPORT_DELETE]({ dispatch, rootState }, id) {
    await ReportsService.deleteReport(id);
    dispatch(FETCH_REPORTS, rootState.units.activeUnit);
  },

  async [SAVE_TEMPLATE](context, payload) {
    await TemplatesService.addTemplate(payload);
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

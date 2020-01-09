/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-shadow */
import {
  SELECT_ISSUE,
  SET_ISSUES,
} from '../mutations';
import {
  ISSUES_FETCH,
  ISSUE_UPDATE,
  CREATE_TICKET,
} from '../actions';
import ApiService, { IssuesService } from '@/common/api.service';

const state = {
  items: [],
  selectedIssueId: null,
};

const getters = {
  allIssues(state) {
    return state.items;
  },
  issueById(state) {
    return state.items.filter((i) => i.id === state.selectedIssueId)[0];
  },
  isSelected(state) {
    return !!state.selectedIssueId;
  },
};

const actions = {
  async [ISSUES_FETCH]({ commit }, unitSlug) {
    const { data } = await IssuesService.fetchIssuesByUnit(unitSlug);
    commit(SET_ISSUES, data);
  },
  async [ISSUE_UPDATE]({ commit }, payload) {
    IssuesService.updateIssues(payload);
  },
  async [CREATE_TICKET](context, { id, fields }) {
    const { data } = await IssuesService.createTicket(id, fields);
    return data;
  },
};

const mutations = {
  [SELECT_ISSUE](state, id) {
    state.selectedIssueId = parseInt(id, 10);
  },
  [SET_ISSUES](state, issues) {
    state.items = issues;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

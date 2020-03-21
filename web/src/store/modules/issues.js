/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-shadow */
import {
  getIssues,
  updateIssues,
  createTicket,
  postComment,
} from '@/api/issues.service';
import { SET_ISSUES } from '../mutations';
import {
  ISSUES_FETCH,
  ISSUE_UPDATE,
  CREATE_TICKET,
  POST_COMMENT,
} from '../actions';

const state = {
  issues: [],
};

const getters = {};

const actions = {
  async [ISSUES_FETCH]({ commit }, unit) {
    const { data } = await getIssues(unit);
    commit(SET_ISSUES, data);
  },

  async [ISSUE_UPDATE]({ dispatch, rootState }, { ids, change }) {
    await updateIssues({ ids, change });
    dispatch(ISSUES_FETCH, rootState.units.activeUnit);
  },

  async [CREATE_TICKET]({ dispatch, rootState }, { id, fields }) {
    const { data } = await createTicket(id, fields);
    dispatch(ISSUES_FETCH, rootState.units.activeUnit);
    return data;
  },

  async [POST_COMMENT]({ dispatch, rootState }, { id, comment }) {
    const { data } = await postComment(id, comment);
    dispatch(ISSUES_FETCH, rootState.units.activeUnit);
    return data;
  },
};

const mutations = {
  [SET_ISSUES](state, issues) {
    state.issues = issues;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

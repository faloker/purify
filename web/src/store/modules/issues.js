/* eslint no-param-reassign: ["error", { "props": false }] */
/* eslint-disable no-shadow */
import {
  getIssues,
  updateIssues,
  createTicket,
  postComment,
  getComments,
} from '@/api/issues.service';
import { SET_ISSUES, SET_COMMENTS } from '../mutations';
import { ISSUES_FETCH, ISSUE_UPDATE, CREATE_TICKET, POST_COMMENT, GET_COMMENTS } from '../actions';

const state = {
  issues: [],
  comments: [],
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

  async [POST_COMMENT]({ dispatch, rootState }, { issueId, comment }) {
    const { data } = await postComment(issueId, comment);
    dispatch(GET_COMMENTS, issueId);
  },

  async [GET_COMMENTS]({ commit }, issueId) {
    const { data } = await getComments(issueId);
    commit(SET_COMMENTS, data);
  },
};

const mutations = {
  [SET_ISSUES](state, issues) {
    state.issues = issues;
  },

  [SET_COMMENTS](state, comments) {
    state.comments = comments;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

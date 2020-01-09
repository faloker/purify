/* eslint-disable no-shadow */
import { SET_ACTIVE_PAGE } from '../mutations';

const state = {
  view: null,
};

const getters = {
  activePage(state) {
    return state.view;
  },
};

const actions = {

};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_ACTIVE_PAGE](state, activeView) {
    state.view = activeView;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

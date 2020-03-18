/* eslint-disable no-shadow */
import ApiService from '@/common/api.service';
import {
  TEMPLATES_FETCH,
  TEMPLATES_DELETE,
  TEMPLATES_EDIT,
} from '@/store/actions';
import {
  TEMPLATES_SET,
} from '@/store/mutations';

const state = {
  templates: [],
};

const getters = {};

const actions = {
  async [TEMPLATES_FETCH]({ commit }) {
    const { data } = await ApiService.get('templates');
    commit(TEMPLATES_SET, data);
  },

  async [TEMPLATES_DELETE]({ dispatch }, id) {
    await ApiService.delete(`/templates/${id}`);
    dispatch(TEMPLATES_FETCH);
  },

  async [TEMPLATES_EDIT]({ dispatch }, { id, change }) {
    await ApiService.patch(`/templates/${id}`, change);
    dispatch(TEMPLATES_FETCH);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [TEMPLATES_SET](state, templates) {
    state.templates = templates;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

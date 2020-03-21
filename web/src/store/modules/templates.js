/* eslint-disable no-shadow */
import {
  getTemplates,
  deleteTemplate,
  editTemplate,
} from '@/api/templates.service';
import {
  TEMPLATES_FETCH,
  TEMPLATES_DELETE,
  TEMPLATES_EDIT,
} from '@/store/actions';
import { TEMPLATES_SET } from '@/store/mutations';

const state = {
  templates: [],
};

const getters = {};

const actions = {
  async [TEMPLATES_FETCH]({ commit }) {
    const { data } = await getTemplates();
    commit(TEMPLATES_SET, data);
  },

  async [TEMPLATES_DELETE]({ dispatch }, id) {
    await deleteTemplate(id);
    dispatch(TEMPLATES_FETCH);
  },

  async [TEMPLATES_EDIT]({ dispatch }, { id, change }) {
    await editTemplate(id, change);
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

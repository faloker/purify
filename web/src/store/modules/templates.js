/* eslint-disable no-shadow */
import { getTemplates, deleteTemplate, editTemplate } from '@/api/templates.service';
import { TEMPLATES_FETCH, TEMPLATES_DELETE, TEMPLATES_EDIT } from '@/store/actions';
import { TEMPLATES_SET } from '@/store/mutations';

const state = {
  templates: [],
};

const getters = {
  // templatesTags(state) {
  //   return [...new Set([].concat(...state.templates.map((item) => item.template.tags)))];
  // },
  findTemplateByName: (state) => (name) => {
    return state.templates.find((item) => item.template.name === name);
  },
};

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

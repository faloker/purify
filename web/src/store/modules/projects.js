/* eslint-disable no-shadow */
import axios from 'axios';
import {
  FETCH_PROJECTS,
  DELETE_PROJECT,
  CREATE_PROJECT,
  FETCH_STATS,
  EDIT_PROJECT,
} from '@/store/actions';
import {
  SET_PROJECTS,
  SET_ACTIVE_PROJECT,
  SET_STATS,
} from '@/store/mutations';

const state = {
  projects: [],
  activeProject: {},
  stats: {},
};

const getters = {};

const actions = {
  async [FETCH_PROJECTS]({ commit }) {
    const { data } = await axios.get('projects');
    commit(SET_PROJECTS, data);
  },

  async [FETCH_STATS]({ commit }, project) {
    const { data } = await axios.query('projects/stats', {
      params: { project },
    });
    commit(SET_STATS, data);
  },

  async [CREATE_PROJECT]({ dispatch }, payload) {
    await axios.post('projects', payload);
    dispatch(FETCH_PROJECTS);
  },

  async [DELETE_PROJECT]({ dispatch }, id) {
    await axios.delete(`/projects/${id}`);
    dispatch(FETCH_PROJECTS);
  },

  async [EDIT_PROJECT]({ dispatch }, { id, change }) {
    await axios.patch(`/projects/${id}`, change);
    dispatch(FETCH_PROJECTS);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_PROJECTS](state, projects) {
    state.projects = projects;
  },
  [SET_ACTIVE_PROJECT](state, project) {
    state.activeProject = project;
  },
  [SET_STATS](state, stats) {
    state.stats = stats;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

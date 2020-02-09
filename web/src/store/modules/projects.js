/* eslint-disable no-shadow */
import ApiService from '@/common/api.service';
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
  projectsList: [],
  activeProject: {},
  stats: {},
};

const getters = {
  projectsList(state) {
    return state.projectsList;
  },

  activeProject(state) {
    return state.activeProject;
  },

  projectStats(state) {
    return state.stats;
  },
};

const actions = {
  async [FETCH_PROJECTS](context) {
    const { data } = await ApiService.get('projects/');
    context.commit(SET_PROJECTS, data);
  },

  async [FETCH_STATS](context, project) {
    const { data } = await ApiService.query('projects/stats', {
      params: { project },
    });
    context.commit(SET_STATS, data);
  },

  async [CREATE_PROJECT](context, payload) {
    await ApiService.post('projects/', payload);
    context.dispatch(FETCH_PROJECTS);
  },

  async [DELETE_PROJECT](context, id) {
    await ApiService.delete(`/projects/${id}`);
    context.dispatch(FETCH_PROJECTS);
  },

  async [EDIT_PROJECT](context, { id, change }) {
    await ApiService.patch(`/projects/${id}`, change);
    context.dispatch(FETCH_PROJECTS);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_PROJECTS](state, projects) {
    state.projectsList = projects;
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

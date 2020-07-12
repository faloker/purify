/* eslint-disable no-shadow */
import {
  getProjects,
  getStats,
  createProject,
  deleteProject,
  editProject,
} from '@/api/projects.service';
import {
  FETCH_PROJECTS,
  DELETE_PROJECT,
  CREATE_PROJECT,
  FETCH_STATS,
  EDIT_PROJECT,
} from '@/store/actions';
import { SET_PROJECTS, SET_ACTIVE_PROJECT, SET_STATS } from '@/store/mutations';

const state = {
  projects: [],
  activeProject: {},
  stats: {},
};

const getters = {};

const actions = {
  async [FETCH_PROJECTS]({ commit }) {
    const { data } = await getProjects();
    commit(SET_PROJECTS, data);
  },

  async [FETCH_STATS]({ commit }, project) {
    const { data } = await getStats(project);
    commit(SET_STATS, data);
  },

  async [CREATE_PROJECT]({ dispatch }, payload) {
    await createProject(payload);
    dispatch(FETCH_PROJECTS);
  },

  async [DELETE_PROJECT]({ dispatch }, slug) {
    await deleteProject(slug);
    dispatch(FETCH_PROJECTS);
  },

  async [EDIT_PROJECT]({ dispatch }, { slug, change }) {
    await editProject(slug, change);
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

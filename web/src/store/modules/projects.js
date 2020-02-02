/* eslint-disable no-shadow */
import { ProjectsService } from '@/common/api.service';
import ApiService from '@/common/api.service';
import {
  FETCH_PROJECTS,
  DELETE_PROJECT,
  CREATE_PROJECT,
  FETCH_STATS,
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
    const { data } = await ProjectsService.getProjects();
    context.commit(SET_PROJECTS, data);
  },

  async [FETCH_STATS](context, project) {
    const { data } = await ApiService.query('projects/stats', {
      params: { project },
    });
    context.commit(SET_STATS, data);
  },

  async [CREATE_PROJECT](context, payload) {
    await ProjectsService.createProject(payload);
    context.dispatch(FETCH_PROJECTS);
  },

  [DELETE_PROJECT](id) {
    return ProjectsService.deleteProject(id);
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

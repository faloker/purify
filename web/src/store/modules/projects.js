/* eslint-disable no-shadow */
import { ProjectsService } from '@/common/api.service';
import {
  CHANGE_PROJECT_NAME,
  FETCH_PROJECTS,
  DELETE_PROJECT,
  CREATE_PROJECT,
} from '@/store/actions';
import {
  SET_PROJECTS,
  SET_ACTIVE_PROJECT,
} from '@/store/mutations';

const state = {
  projectsList: [],
  activeProject: {},
};

const getters = {
  projectsList(state) {
    return state.projectsList;
  },
  activeProject(state) {
    return state.activeProject;
  },
};

const actions = {
  async [FETCH_PROJECTS](context) {
    const { data } = await ProjectsService.getProjects();
    context.commit(SET_PROJECTS, data);
  },
  async [CREATE_PROJECT](context, payload) {
    await ProjectsService.createProject(payload);
    context.dispatch(FETCH_PROJECTS);
  },
  // TODO
  // [CHANGE_APP_NAME]() {},
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
};

export default {
  state,
  getters,
  actions,
  mutations,
};

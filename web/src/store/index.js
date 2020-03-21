import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import projects from './modules/projects';
import issues from './modules/issues';
import reports from './modules/reports';
import units from './modules/units';
import auth from './modules/auth';
import profile from './modules/profile';
import templates from './modules/templates';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    projects,
    issues,
    reports,
    units,
    profile,
    templates,
  },
});

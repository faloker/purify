import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import projects from './modules/projects';
import issues from './modules/issues';
import report from './modules/reports';
import releases from './modules/releases';
import auth from './modules/auth';
import profile from './modules/profile';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    auth,
    app,
    projects,
    issues,
    report,
    releases,
    profile,
  },
});

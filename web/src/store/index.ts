import Vue from 'vue';
import Vuex from 'vuex';

import System from './modules/system';
import Projects from './modules/projects';
import Issues from './modules/issues';
import Reports from './modules/reports';
import Units from './modules/units';
import Auth from './modules/auth';
import Profile from './modules/profile';
import Templates from './modules/templates';
import Users from './modules/users';
import Events from './modules/events';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    system: System,
    auth: Auth,
    projects: Projects,
    issues: Issues,
    reports: Reports,
    units: Units,
    profile: Profile,
    templates: Templates,
    users: Users,
    events: Events,
  },
});

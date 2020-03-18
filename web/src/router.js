import Vue from 'vue';
import Router from 'vue-router';

import TheHeader from '@/components/TheHeader.vue';
// import PersonalSettings from '@/components/PersonalSettings.vue';
import Projects from '@/views/Projects.vue';
import Units from '@/views/Units.vue';
import Welcome from '@/views/Welcome.vue';
// import Profile from '@/views/Profile.vue';
import Dashboard from '@/views/Dashboard.vue';
// import JiraTicketDialog from '@/components/dialogs/JiraTicketDialog.vue';
import store from './store';
import { REFRESH_TOKEN } from './store/actions';

Vue.use(Router);

// eslint-disable-next-line import/prefer-default-export
export const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/projects',
    },
    {
      path: '/welcome',
      name: 'Welcome',
      components: {
        default: Welcome,
      },
      meta: { title: 'Purify | Welcome' },
    },
    {
      path: '/projects',
      name: 'Projects',
      components: {
        default: Projects,
        header: TheHeader,
      },
      meta: { title: 'Purify | Projects' },
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      components: {
        default: Dashboard,
        header: TheHeader,
      },
      meta: { title: 'Purify | Dashboard' },
    },
    {
      path: '/project/:slug/units',
      name: 'Units',
      components: {
        default: Units,
        header: TheHeader,
      },
      meta: { title: 'Purify | Units' },
    },
    {
      path: '/unit/:slug/issues',
      name: 'Issues',
      components: {
        default: () => import('@/views/Issues.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Issues' },
    },
    {
      path: '/unit/:slug/reports',
      name: 'Reports',
      components: {
        default: () => import('@/views/Reports.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Reports' },
    },
  ],
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = store.getters;
  document.title = to.meta.title;

  if (to.path !== '/welcome' && !isAuthenticated) {
    store.dispatch(REFRESH_TOKEN);
  }

  if (to.path !== '/welcome' && !isAuthenticated) {
    next('/welcome');
  } else {
    next();
  }
});

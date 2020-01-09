import Vue from 'vue';
import Router from 'vue-router';

import store from './store';
import TheHeader from '@/components/TheHeader.vue';
import PersonalSettings from '@/components/PersonalSettings.vue';
import TokensSettings from '@/components/TokensSettings.vue';

import Projects from '@/views/Projects.vue';
import Units from '@/views/Units.vue';
import Settings from '@/views/Settings.vue';
import ReleasePage from '@/views/ReleasePage.vue';
import Welcome from '@/views/Welcome.vue';
import Profile from '@/views/Profile.vue';
import JiraTicketDialog from '@/components/dialogs/JiraTicketDialog.vue';
import { CHECK_AUTH } from './store/actions';


Vue.use(Router);

// eslint-disable-next-line import/prefer-default-export
export const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/', redirect: 'projects',
    },
    {
      path: '/welcome',
      name: 'Welcome',
      components: {
        default: Welcome,
      },
    },
    {
      path: '/projects',
      name: 'Projects',
      components: {
        default: Projects,
        header: TheHeader,
      },
    },
    {
      path: '/project/:slug/units',
      name: 'Units',
      components: {
        default: Units,
        header: TheHeader,
      },
    },
    {
      path: '/unit/:slug/issues',
      name: 'Issues',
      components: {
        default: () => import('@/views/Issues.vue'),
        header: TheHeader,
      },
    },
    {
      path: '/unit/:slug/reports',
      name: 'Reports',
      components: {
        default: () => import('@/views/Reports.vue'),
        header: TheHeader,
      },
    },
    // {
    //   path: '/profile',
    //   name: 'Profile',
    //   components: {
    //     default: Profile,
    //     header: TheHeader,
    //   },
    // },
    // {
    //   path: '/settings',
    //   name: 'Settings',
    //   components: {
    //     default: Settings,
    //     header: TheHeader,
    //   },
    // },
  ],
});

router.beforeEach((to, from, next) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/welcome'];
  const authRequired = !publicPages.includes(to.path);
  const { isAuthenticated } = store.getters;

  if (authRequired && !isAuthenticated) {
    return next('/welcome');
  }

  if (to.path !== '/welcome') {
    store.dispatch(CHECK_AUTH);
  }

  return next();
});

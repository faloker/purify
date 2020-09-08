import Vue from 'vue';
import Router from 'vue-router';

import TheHeader from '@/components/TheHeader.vue';
import store from './store';
import { REFRESH_TOKEN, FETCH_SYSTEM_SETUP, SAML_LOGIN } from './store/actions';
import { SET_PROJECT_NAME, SET_UNIT_NAME } from './store/mutations';

Vue.use(Router);

export const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/overview',
    },
    {
      path: '/welcome',
      name: 'Welcome',
      components: {
        default: () => import('@/views/Welcome.vue'),
      },
      meta: { title: 'Purify | Welcome' },
    },
    {
      path: '/overview',
      name: 'Overview',
      components: {
        default: () => import('@/views/Overview.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Overview' },
    },
    {
      path: '/welcome/:token',
      name: 'ChangePassword',
      components: {
        default: () => import('@/views/ChangePassword.vue'),
      },
      meta: { title: 'Purify | Change Password' },
    },
    {
      path: '/projects',
      name: 'Projects',
      components: {
        default: () => import('@/views/Projects.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Projects' },
    },
    {
      path: '/templates',
      name: 'Templates',
      components: {
        default: () => import('@/views/Templates.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Templates' },
    },
    {
      path: '/users',
      name: 'Users',
      components: {
        default: () => import('@/views/Users.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Users' },
    },
    {
      path: '/projects/:projectName',
      name: 'ProjectPage',
      components: {
        default: () => import('@/views/ProjectPage.vue'),
        header: TheHeader,
      },
      children: [
        {
          path: 'overview',
          name: 'ProjectOverview',
          components: {
            default: () => import('@/views/ProjectOverview.vue'),
          },
          meta: { title: 'Purify | Overview' },
        },
        {
          path: 'units/overview',
          name: 'Units',
          meta: { title: 'Purify | Units' },
          components: {
            default: () => import('@/views/Units.vue'),
          },
        },
        {
          path: 'units/:unitName/issues',
          name: 'Issues',
          components: {
            default: () => import('@/views/Issues.vue'),
          },
          meta: { title: 'Purify | Issues' },
        },
        {
          path: 'units/:unitName/reports',
          name: 'Reports',
          components: {
            default: () => import('@/views/Reports.vue'),
          },
          meta: { title: 'Purify | Reports' },
        },
      ],
    },
    {
      path: '/saml/login/:token',
      name: 'SAML Login',
    },
  ],
});

// TODO refactor router
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = store.state.auth;

  if (to.params.projectName) {
    store.commit(SET_PROJECT_NAME, to.params.projectName);
  } else {
    store.commit(SET_PROJECT_NAME, '');
  }

  if (to.params.unitName) {
    store.commit(SET_UNIT_NAME, to.params.unitName);
  } else {
    store.commit(SET_UNIT_NAME, '');
  }

  if (to.name === 'Welcome') {
    await store.dispatch(FETCH_SYSTEM_SETUP).catch(() => {});
  }

  if (to.name === 'SAML Login') {
    await store.dispatch(SAML_LOGIN, atob(to.params.token));
    // fix router to correctly set page title after redirection
    // sidenote: routing to Projects appears to happen before routing to saml/login/
    next('Projects');
  }

  if (
    !['Welcome', 'SAML Login', 'ChangePassword'].includes(to.name!) &&
    !isAuthenticated
  ) {
    store
      .dispatch(REFRESH_TOKEN)
      .then(() => {
        document.title = to.meta.title;
        next();
      })
      .catch(() => {
        document.title = 'Purify | Welcome';
        next('/welcome');
      });
  } else if (['Welcome', 'SAML Login'].includes(to.name!) && isAuthenticated) {
    next(false);
  } else {
    document.title = to.meta.title;
    next();
  }
});

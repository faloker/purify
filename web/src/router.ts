import Vue from 'vue';
import Router from 'vue-router';

import TheHeader from '@/components/TheHeader.vue';
import store from './store';
import { REFRESH_TOKEN, FETCH_SYSTEM_SETUP, SAML_LOGIN } from './store/actions';

Vue.use(Router);

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
        default: () => import('@/views/Welcome.vue'),
      },
      meta: { title: 'Purify | Welcome' },
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
      path: '/dashboard',
      name: 'Dashboard',
      components: {
        default: () => import('@/views/Dashboard.vue'),
        header: TheHeader,
      },
      meta: { title: 'Purify | Dashboard' },
    },
    {
      path: '/project/:slug/units',
      name: 'Units',
      components: {
        default: () => import('@/views/Units.vue'),
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
    {
      path: '/saml/login/:token',
      name: 'SAML Login',
    },
  ],
});

// TODO refactor router
router.beforeEach(async (to, from, next) => {
  const { isAuthenticated } = store.state.auth;

  if (to.name === 'Welcome') {
    await store.dispatch(FETCH_SYSTEM_SETUP).catch(() => {});
  }

  if (to.name === 'SAML Login') {
    await store.dispatch(SAML_LOGIN, atob(to.params.token));
    // fix router to correctly set page title after redirection
    // sidenote: routing to Projects appears to happen before routing to saml/login/
    next('Projects');
  }

  if (!['Welcome', 'SAML Login'].includes(to.name!) && !isAuthenticated) {
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

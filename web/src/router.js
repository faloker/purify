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

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = store.getters;

  if (to.path === '/welcome') {
    store.dispatch(FETCH_SYSTEM_SETUP);
  }

  if (to.name === 'SAML Login') {
    store.dispatch(SAML_LOGIN, { token: atob(to.params.token) });
    store.dispatch(FETCH_SYSTEM_SETUP);
    next('/projects');
  }

  if (to.path !== '/welcome' && !isAuthenticated) {
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
  } else if ((to.path === '/welcome' || to.name === 'SAML Login') && isAuthenticated) {
    next(false);
  } else {
    document.title = to.meta.title;
    next();
  }
});

/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import { login, signup, refreshToken, logout } from '@/api/auth.service';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
import { LOGIN, LOGOUT, REGISTER, REFRESH_TOKEN, AUTO_REFRESH, PROFILE_FETCH } from '../actions';
import { SET_AUTH, PURGE_AUTH, SET_USER, REFRESH_TASK } from '../mutations';

const state = {
  user: {},
  isAuthenticated: false,
  refreshTask: null,
};

const getters = {
  isAuthenticated(state) {
    return state.isAuthenticated;
  },

  token(state) {
    return state.user.token;
  },
};

const actions = {
  async [LOGOUT]({ commit }) {
    await logout();
    commit(PURGE_AUTH);
  },

  async [LOGIN]({ commit, dispatch }, credentials) {
    const { data } = await login(credentials);

    commit(SET_AUTH, data);
    dispatch(AUTO_REFRESH);
  },

  async [REGISTER]({ commit, dispatch }, credentials) {
    const { data } = await signup(credentials);

    commit(SET_AUTH, data);
    dispatch(AUTO_REFRESH);
  },

  async [REFRESH_TOKEN]({ commit, dispatch }) {
    const { data } = await refreshToken();

    commit(SET_AUTH, data);
    dispatch(AUTO_REFRESH);
  },

  async [AUTO_REFRESH]({ state, dispatch, commit }) {
    dispatch(PROFILE_FETCH);

    const { exp } = jwt_decode(state.user.token);
    const now = Date.now();

    let timeUntilRefresh = exp * 1000 - now;
    timeUntilRefresh -= 120000;

    const refreshTask = setTimeout(() => dispatch(REFRESH_TOKEN), timeUntilRefresh);
    commit(REFRESH_TASK, refreshTask);
  },
};

const mutations = {
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data;
  },

  [SET_USER](state, user) {
    state.user = user;
  },

  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
  },

  [REFRESH_TASK](state, task) {
    state.refreshTask = task;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

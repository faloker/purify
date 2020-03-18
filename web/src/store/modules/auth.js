/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
import ApiService from '@/common/api.service';
import axios from 'axios';
// eslint-disable-next-line camelcase
import jwt_decode from 'jwt-decode';
// import JwtService from '@/common/jwt.service';
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  REFRESH_TOKEN,
  AUTO_REFRESH,
} from '../actions';
import {
  SET_AUTH, PURGE_AUTH, SET_USER, REFRESH_TASK,
} from '../mutations';

const state = {
  user: {},
  isAuthenticated: false,
  refreshTask: null,
};

const getters = {
  currentUser(state) {
    return state.user;
  },

  isAuthenticated(state) {
    return state.isAuthenticated;
  },

  accessToken(state) {
    return state.user.token;
  },
};

const actions = {
  [LOGOUT]({ commit }) {
    commit(PURGE_AUTH);
  },

  async [LOGIN]({ commit, dispatch }, credentials) {
    const { data } = await axios.post('auth', credentials);

    commit(SET_AUTH, data);
    dispatch(AUTO_REFRESH);
  },

  async [REGISTER]({ commit, dispatch }, credentials) {
    const { data } = await axios.post('auth/signup', credentials);

    commit(SET_AUTH, data);
    dispatch(AUTO_REFRESH);
  },

  async [REFRESH_TOKEN]({ commit, dispatch }) {
    const { data } = await axios.get('auth/refresh_token', {
      withCredentials: true,
    });

    commit(SET_AUTH, data);
    dispatch(AUTO_REFRESH);
  },

  async [AUTO_REFRESH]({ state, dispatch, commit }) {
    const { exp } = jwt_decode(state.user.token);
    const now = Date.now();

    let timeUntilRefresh = exp * 1000 - now;
    timeUntilRefresh -= 120000;

    const refreshTask = setTimeout(
      () => dispatch(REFRESH_TOKEN),
      timeUntilRefresh,
    );
    commit(REFRESH_TASK, refreshTask);
  },
};

const mutations = {
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data;
    ApiService.setHeader(data.token);
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

import ApiService from '@/common/api.service';
import JwtService from '@/common/jwt.service';
import {
  LOGIN, LOGOUT, REGISTER, CHECK_AUTH, UPDATE_USER,
} from '../actions';
import { SET_AUTH, PURGE_AUTH, SET_USER } from '../mutations';

const state = {
  errors: null,
  user: {},
  isAuthenticated: !!JwtService.getToken(),
};

const getters = {
  currentUser(state) {
    return state.user;
  },
  isAuthenticated(state) {
    return state.isAuthenticated;
  },
};

const actions = {
  [LOGOUT]({ commit }) {
    commit(PURGE_AUTH);
  },
  async [LOGIN]({ commit }, credentials) {
    const { data } = await ApiService.post('users/login', credentials);
    commit(SET_AUTH, data);
  },
  async [REGISTER]({ commit }, credentials) {
    const { data } = await ApiService.post('users/signup', credentials);
    commit(SET_AUTH, data);
  },
  async [UPDATE_USER]({ commit }, payload) {
    const {
      email, username, password, image,
    } = payload;
    const user = {
      email,
      username,
      image,
    };
    if (password) {
      user.password = password;
    }

    const { data } = await ApiService.put('user', user);
    commit(SET_AUTH, data.user);
    return data;
  },
  async [CHECK_AUTH]({ commit }) {
    try {
      JwtService.getToken();
      ApiService.setHeader();
      const { data } = await ApiService.get('users/auth');
      commit(SET_USER, data);
    } catch (e) {
      commit(PURGE_AUTH);
      throw e;
    }
  },
};

const mutations = {
  [SET_AUTH](state, data) {
    state.isAuthenticated = true;
    state.user = data;
    JwtService.saveToken(data.token);
  },
  [SET_USER](state, user) {
    state.user = user;
  },
  [PURGE_AUTH](state) {
    state.isAuthenticated = false;
    state.user = {};
    JwtService.destroyToken();
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

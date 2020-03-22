/* eslint-disable no-shadow */
import {
  PROFILE_FETCH,
} from '@/store/actions';
import {
  SET_PROFILE,
} from '@/store/mutations';
import { currentUser } from '@/api/users.service';

const state = {
  user: {},
};

const getters = {
  currentUser(state) {
    return state.user;
  },
};

const actions = {
  async [PROFILE_FETCH]({ commit }) {
    const { data } = await currentUser();
    commit(SET_PROFILE, data);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_PROFILE](state, profile) {
    state.user = profile;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

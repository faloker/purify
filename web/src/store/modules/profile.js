/* eslint-disable no-shadow */
import { ProfileService } from '@/common/api.service';
import {
  FETCH_PROFILE,
} from '@/store/actions';
import {
  SET_PROFILE,
} from '@/store/mutations';

const state = {
  profile: {},
};

const getters = {
  profile(state) {
    return state.profile;
  },
};

const actions = {
  async [FETCH_PROFILE]({ commit, rootState }) {
    const { data } = await ProfileService.get(rootState.auth.user.username);
    commit(SET_PROFILE, data.body.profile);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_PROFILE](state, profile) {
    state.profile = profile;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

/* eslint-disable no-shadow */
import { SET_CONFIG } from '../mutations';
import { getSystemSetup } from '../../api/system.service';
import { FETCH_SYSTEM_SETUP } from '../actions';

const state = {
  setup: {},
};

const getters = {
  systemSetup(state) {
    return state.setup;
  },
};

const actions = {
  async [FETCH_SYSTEM_SETUP]({ commit }) {
    const { data } = await getSystemSetup();
    commit(SET_CONFIG, data);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_CONFIG](state, config) {
    state.setup = config;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

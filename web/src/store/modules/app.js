/* eslint-disable no-shadow */
import { SET_CONFIG, SHOW_MESSAGE } from '../mutations';
import { getSystemSetup } from '../../api/system.service';
import { FETCH_SYSTEM_SETUP } from '../actions';

const state = {
  setup: {},
  snackbar: {
    text: '',
    title: '',
    type: '',
    icon: '',
  },
};

const getters = {
  systemSetup(state) {
    return state.setup;
  },

  currentMessage(state) {
    return state.snackbar;
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

  [SHOW_MESSAGE](state, payload) {
    state.snackbar.text = Array.isArray(payload.text) ? payload.text[0] : payload.text;
    state.snackbar.type = payload.type;
    state.snackbar.title = payload.title;
    state.snackbar.icon = payload.type === 'success' ? 'fa-check' : 'fa-times';
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

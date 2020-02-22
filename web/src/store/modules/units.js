/* eslint-disable no-shadow */
import ApiService from '@/common/api.service';
import {
  FETCH_UNITS,
  DELETE_UNIT,
  CREATE_UNIT,
} from '@/store/actions';
import {
  SET_UNITS,
  SET_ACTIVE_UNIT,
} from '@/store/mutations';

const state = {
  units: [],
  activeUnit: {},
};

const getters = {};

const actions = {
  async [FETCH_UNITS]({ commit, rootState }) {
    const { data } = await ApiService.query('units/', {
      params: { project: rootState.projects.activeProject },
    });
    commit(SET_UNITS, data);
  },
  async [CREATE_UNIT]({ dispatch, rootState }, name) {
    await ApiService.post('units/', {
      name,
      project: rootState.projects.activeProject,
    });
    dispatch(FETCH_UNITS, rootState.projects.activeProject);
  },
  async [DELETE_UNIT]({ dispatch, rootState }, id) {
    await ApiService.delete(`units/${id}`);
    dispatch(FETCH_UNITS, rootState.projects.activeProject);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_UNITS](state, units) {
    state.units = units;
  },
  [SET_ACTIVE_UNIT](state, unit) {
    state.activeUnit = unit;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

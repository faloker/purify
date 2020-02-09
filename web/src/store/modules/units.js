/* eslint-disable no-shadow */
import ApiService from '@/common/api.service';
import {
  FETCH_UNITS,
  DELETE_UNIT,
  CREATE_UNIT,
} from '@/store/actions';
import {
  SET_UNITS,
  SET_RELEASE,
} from '@/store/mutations';

const state = {
  unitsList: [],
  release: {},
};

const getters = {
  unitsList(state) {
    return state.unitsList;
  },
  activeRelease(state) {
    return state.release;
  },
};

const actions = {
  async [FETCH_UNITS](context, slug) {
    const { data } = await ApiService.query('units/', {
      params: { project: slug },
    });
    context.commit(SET_UNITS, data);
  },
  async [CREATE_UNIT](context, { name, project }) {
    await ApiService.post('units/', { name, project });
    context.dispatch(FETCH_UNITS, project);
  },
  async [DELETE_UNIT](context, { id, project }) {
    await ApiService.delete(`units/${id}`);
    context.dispatch(FETCH_UNITS, project);
  },
};

/* eslint no-param-reassign: ["error", { "props": false }] */
const mutations = {
  [SET_UNITS](state, units) {
    state.unitsList = units;
  },
  [SET_RELEASE](state, release) {
    state.release = release;
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};

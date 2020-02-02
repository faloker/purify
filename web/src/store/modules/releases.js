/* eslint-disable no-shadow */
import { UnitsService } from '@/common/api.service';
import {
  FETCH_UNITS,
  DELETE_RELEASE,
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
    const { data } = await UnitsService.get(slug);
    context.commit(SET_UNITS, data);
  },
  async [CREATE_UNIT](context, payload) {
    const { data } = await UnitsService.create(payload);
    context.dispatch(FETCH_UNITS, payload.project);
    return data;
  },
  [DELETE_RELEASE](id) {
    return UnitsService.deleteRelease(id);
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

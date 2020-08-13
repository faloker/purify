import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getUnits,
  createUnit,
  deleteUnit,
  editUnit,
} from '@/api/units.service';
import {
  FETCH_UNITS,
  DELETE_UNIT,
  CREATE_UNIT,
  EDIT_UNIT,
} from '@/store/actions';
import { SET_UNITS } from '@/store/mutations';
import { Unit, CreateUnitDto, EditUnitDto } from '../types';

@Module
export default class Units extends VuexModule {
  items: Unit[] = [];

  @Mutation
  [SET_UNITS](units: Unit[]) {
    function calcProgress(item: Unit) {
      return (item.closed_tickets / item.tickets || 0) * 100;
    }

    units.forEach((unit: Unit) => {
      unit.progress = calcProgress(unit);
    });

    this.items = units;
  }

  @Action
  async [FETCH_UNITS](projectSlug: string) {
    const { data } = await getUnits(projectSlug);
    this.context.commit(SET_UNITS, data);
  }

  @Action
  async [CREATE_UNIT](payload: CreateUnitDto) {
    await createUnit(payload.name, payload.project);
    this.context.dispatch(FETCH_UNITS, payload.project);
  }

  @Action
  async [DELETE_UNIT](slug: string) {
    await deleteUnit(slug);
  }

  @Action
  async [EDIT_UNIT](payload: EditUnitDto) {
    await editUnit(payload.slug, payload.name);
  }
}

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
      return (item.numClosedIssues / item.numIssues || 0) * 100;
    }

    units.forEach((unit: Unit) => {
      unit.progress = calcProgress(unit);
    });

    this.items = units;
  }

  @Action
  async [FETCH_UNITS]() {
    const { data } = await getUnits(this.context.rootState.system.projectName);
    this.context.commit(SET_UNITS, data);
  }

  @Action
  async [CREATE_UNIT](createUnitDto: CreateUnitDto) {
    await createUnit(this.context.rootState.system.projectName, createUnitDto);
    this.context.dispatch(FETCH_UNITS);
  }

  @Action
  async [DELETE_UNIT](unitName: string) {
    await deleteUnit(unitName);
    this.context.dispatch(FETCH_UNITS);
  }

  @Action
  async [EDIT_UNIT](editUnitDto: EditUnitDto) {
    await editUnit(editUnitDto.name, editUnitDto.displayName);
    this.context.dispatch(FETCH_UNITS);
  }
}

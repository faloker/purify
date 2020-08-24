import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getProjects,
  getStats,
  createProject,
  deleteProject,
  editProject,
} from '@/api/projects.service';
import {
  FETCH_PROJECTS,
  DELETE_PROJECT,
  CREATE_PROJECT,
  FETCH_STATS,
  EDIT_PROJECT,
} from '@/store/actions';
import { SET_PROJECTS, SET_STATS } from '@/store/mutations';
import { Project, EditProjectDto, CreateProjectDto } from '../types';

@Module
export default class Projects extends VuexModule {
  items: Project[] = [];
  stats: any = {};

  @Mutation
  [SET_PROJECTS](projects: Project[]) {
    this.items = projects;
  }

  @Mutation
  [SET_STATS](stats: any) {
    this.stats = stats;
  }

  @Action
  async [FETCH_PROJECTS](verbose = false) {
    const { data } = await getProjects(verbose);
    this.context.commit(SET_PROJECTS, data);
  }

  @Action
  async [FETCH_STATS](slug: string) {
    const { data } = await getStats(slug);
    this.context.commit(SET_STATS, data);
  }

  @Action
  async [CREATE_PROJECT](payload: CreateProjectDto) {
    await createProject(payload);
    this.context.dispatch(FETCH_PROJECTS);
  }

  @Action
  async [DELETE_PROJECT](slug: string) {
    await deleteProject(slug);
    this.context.dispatch(FETCH_PROJECTS);
  }

  @Action
  async [EDIT_PROJECT](payload: EditProjectDto) {
    await editProject(payload.slug, payload.change);
    this.context.dispatch(FETCH_PROJECTS);
  }
}

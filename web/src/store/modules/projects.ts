import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getProjects,
  getMetrics,
  createProject,
  deleteProject,
  editProject,
  getUsers,
  addUser,
  removeUser,
} from '@/api/projects.service';
import {
  FETCH_PROJECTS,
  DELETE_PROJECT,
  CREATE_PROJECT,
  FETCH_METRICS,
  EDIT_PROJECT,
  FETCH_PROJECT_USERS,
  FETCH_USERS,
  ADD_USER,
  REMOVE_USER,
} from '@/store/actions';
import {
  SET_PROJECTS,
  SET_METRICS,
  SET_PROJECT_USERS,
} from '@/store/mutations';
import {
  Project,
  EditProjectDto,
  CreateProjectDto,
  User,
  AddUserDto,
  FetchMetricsDto,
} from '../types';

@Module
export default class Projects extends VuexModule {
  items: Project[] = [];
  stats: any = {};
  users: User[] = [];

  @Mutation
  [SET_PROJECTS](projects: Project[]) {
    this.items = projects;
  }

  @Mutation
  [SET_METRICS](stats: any) {
    this.stats = stats;
  }

  @Mutation
  [SET_PROJECT_USERS](users: User[]) {
    this.users = users;
  }

  @Action
  async [FETCH_PROJECTS](verbose = false) {
    const { data } = await getProjects(verbose);
    this.context.commit(SET_PROJECTS, data);
  }

  @Action
  async [FETCH_METRICS](fetchMetricsDto: FetchMetricsDto) {
    const { data } = await getMetrics(
      this.context.rootState.system.projectName,
      fetchMetricsDto.days
    );
    this.context.commit(SET_METRICS, data);
  }

  @Action
  async [CREATE_PROJECT](payload: CreateProjectDto) {
    await createProject(payload);
    await this.context.dispatch(FETCH_PROJECTS, true);
  }

  @Action
  async [DELETE_PROJECT](projectName: string) {
    await deleteProject(projectName);
    await this.context.dispatch(FETCH_PROJECTS, true);
  }

  @Action
  async [EDIT_PROJECT](payload: EditProjectDto) {
    await editProject(payload.name, payload.change);
    await this.context.dispatch(FETCH_PROJECTS, true);
  }

  @Action
  async [ADD_USER](payload: AddUserDto) {
    await addUser(payload);
    await this.context.dispatch(FETCH_USERS);
  }

  @Action
  async [REMOVE_USER](payload: AddUserDto) {
    await removeUser(payload);
    await this.context.dispatch(FETCH_USERS);
  }
}

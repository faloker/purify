import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getProjects,
  getStats,
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
  FETCH_STATS,
  EDIT_PROJECT,
  FETCH_PROJECT_USERS,
  FETCH_USERS,
  ADD_USER,
  REMOVE_USER,
} from '@/store/actions';
import { SET_PROJECTS, SET_STATS, SET_PROJECT_USERS } from '@/store/mutations';
import {
  Project,
  EditProjectDto,
  CreateProjectDto,
  User,
  AddUserDto,
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
  [SET_STATS](stats: any) {
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
  async [FETCH_STATS](slug: string) {
    const { data } = await getStats(slug);
    this.context.commit(SET_STATS, data);
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

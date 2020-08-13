import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { login, signup, refreshToken, logout } from '@/api/auth.service';
import { Credentials } from '../types';
import jwt_decode from 'jwt-decode';
import {
  LOGIN,
  LOGOUT,
  REGISTER,
  REFRESH_TOKEN,
  AUTO_REFRESH,
  PROFILE_FETCH,
  SAML_LOGIN,
} from '../actions';
import { SET_AUTH, PURGE_AUTH, SET_REFRESH_TASK } from '../mutations';

@Module
export default class Auth extends VuexModule {
  refreshTask = null;
  isAuthenticated = false;
  token = '';

  @Action
  async [LOGOUT]() {
    await logout();
    this.context.commit(PURGE_AUTH);
  }

  @Action
  async [LOGIN](credentials: Credentials) {
    const { data } = await login(credentials);

    this.context.commit(SET_AUTH, data.token);
    this.context.dispatch(AUTO_REFRESH);
  }

  @Action
  async [REGISTER](credentials: Credentials) {
    const { data } = await signup(credentials);

    this.context.commit(SET_AUTH, data.token);
    this.context.dispatch(AUTO_REFRESH);
  }

  @Action
  async [REFRESH_TOKEN]() {
    const { data } = await refreshToken();

    this.context.commit(SET_AUTH, data.token);
    this.context.dispatch(AUTO_REFRESH);
  }

  @Action
  async [AUTO_REFRESH]() {
    this.context.dispatch(PROFILE_FETCH);

    const { exp } = jwt_decode(this.token);
    const now = Date.now();

    let timeUntilRefresh = exp * 1000 - now;
    timeUntilRefresh -= 120000;

    const refreshTask = setTimeout(
      () => this.context.dispatch(REFRESH_TOKEN).catch(() => {}),
      timeUntilRefresh
    );
    this.context.commit(SET_REFRESH_TASK, refreshTask);
  }

  @Action
  async [SAML_LOGIN](token: string) {
    this.context.commit(SET_AUTH, token);
    this.context.dispatch(AUTO_REFRESH);
  }

  @Mutation
  [SET_AUTH](token: string) {
    this.isAuthenticated = true;
    this.token = token;
  }

  @Mutation
  [PURGE_AUTH]() {
    this.isAuthenticated = false;
    this.token = '';
  }

  @Mutation
  [SET_REFRESH_TASK](task: any) {
    this.refreshTask = task;
  }
}

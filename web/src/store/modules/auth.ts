import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { login, refreshToken, logout } from '@/api/auth.service';
import { Credentials } from '../types';
import jwt_decode from 'jwt-decode';
import {
  LOGIN,
  LOGOUT,
  REFRESH_TOKEN,
  AUTO_REFRESH,
  SAML_LOGIN,
} from '../actions';
import {
  SET_AUTH,
  PURGE_AUTH,
  SET_REFRESH_TASK,
  SET_PROFILE,
} from '../mutations';
import { currentUser } from '@/api/users.service';

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
    await this.context.dispatch(AUTO_REFRESH);
  }

  @Action
  async [REFRESH_TOKEN]() {
    const { data } = await refreshToken();

    this.context.commit(SET_AUTH, data.token);
    await this.context.dispatch(AUTO_REFRESH);
  }

  @Action
  async [AUTO_REFRESH]() {
    const { exp } = jwt_decode(this.token);
    const now = Date.now();

    const { role, memberships, ssoBypass } = jwt_decode(this.token);
    const { data } = await currentUser();
    const user = { ...data, role, memberships, ssoBypass };
    this.context.commit(SET_PROFILE, user);

    let timeUntilRefresh = exp * 1000 - now;
    timeUntilRefresh -= 120000;

    const refreshTask = setTimeout(
      async () => await this.context.dispatch(REFRESH_TOKEN).catch(() => {}),
      timeUntilRefresh
    );
    this.context.commit(SET_REFRESH_TASK, refreshTask);
  }

  @Action
  async [SAML_LOGIN](token: string) {
    this.context.commit(SET_AUTH, token);
    await this.context.dispatch(AUTO_REFRESH);
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

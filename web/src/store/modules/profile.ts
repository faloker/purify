import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  PROFILE_FETCH,
  SELF_CHANGE,
  FETCH_ACCESS_TOKENS,
  CREATE_ACCESS_TOKEN,
  DELETE_ACCESS_TOKEN,
  FETCH_RECENT_PROJECTS,
  CHANGE_PASSWORD,
  SELF_CHANGE_PASSWORD,
} from '@/store/actions';
import { SET_PROFILE, SET_ACCESS_TOKENS } from '@/store/mutations';
import {
  currentUser,
  changeWhoami,
  getAccessTokens,
  createAccessToken,
  deleteAccessToken,
  getRecentProjects,
  changeMyPassword,
} from '@/api/users.service';
import {
  User,
  Role,
  UserSelfChange,
  Token,
  CreateTokenDto,
  DeleteTokenDto,
  UserChangePasswordDto,
} from '../types';

@Module
export default class Profile extends VuexModule {
  user: User = {
    _id: '',
    name: '',
    email: '',
    image: '',
    ssoBypass: false,
    role: Role.OBSERVER,
    memberships: [],
    recentProjects: [],
  };
  accessTokens: Token[] = [];

  @Mutation
  [SET_PROFILE](user: User) {
    Object.assign(this.user, user);
  }

  @Mutation
  [SET_ACCESS_TOKENS](tokens: Token[]) {
    tokens.forEach((token) => {
      // @ts-ignore
      token.accessDate = token.lastActivity?.date;
      // @ts-ignore
      token.fromIP = token.lastActivity?.fromIP;
      // @ts-ignore
      token.userAgent = token.lastActivity?.userAgent;
    });
    this.accessTokens = tokens;
  }

  @Action
  async [PROFILE_FETCH]() {
    const { data } = await currentUser();
    this.context.commit(SET_PROFILE, data);
  }

  @Action
  async [FETCH_RECENT_PROJECTS]() {
    const { data } = await getRecentProjects();
    this.context.commit(SET_PROFILE, data);
  }

  @Action
  async [SELF_CHANGE](params: UserSelfChange) {
    await changeWhoami(params);
  }

  @Action
  async [FETCH_ACCESS_TOKENS]() {
    const { data } = await getAccessTokens();
    this.context.commit(SET_ACCESS_TOKENS, data);
  }

  @Action
  async [CREATE_ACCESS_TOKEN](createTokenDto: CreateTokenDto) {
    const { data } = await createAccessToken(createTokenDto.name);
    this.context.dispatch(FETCH_ACCESS_TOKENS);
    return data;
  }

  @Action
  async [DELETE_ACCESS_TOKEN](deleteTokenDto: DeleteTokenDto) {
    await deleteAccessToken(deleteTokenDto._id);
    this.context.dispatch(FETCH_ACCESS_TOKENS);
  }

  @Action
  async [SELF_CHANGE_PASSWORD](userChangePasswordDto: UserChangePasswordDto) {
    await changeMyPassword(userChangePasswordDto);
  }
}

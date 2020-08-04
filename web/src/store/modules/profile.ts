import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { PROFILE_FETCH } from '@/store/actions';
import { SET_PROFILE } from '@/store/mutations';
import { currentUser } from '@/api/users.service';
import { User } from '../types';

@Module
export default class Profile extends VuexModule {
  user: User | {} = {};

  @Mutation
  [SET_PROFILE](user: User) {
    this.user = user;
  }

  @Action
  async [PROFILE_FETCH]() {
    const { data } = await currentUser();
    this.context.commit(SET_PROFILE, data);
  }
}

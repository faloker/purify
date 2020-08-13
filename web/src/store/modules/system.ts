import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import { SystemConfig, Message, APIMessage } from '../types';
import { SET_CONFIG, SET_MESSAGE } from '../mutations';
import { getSystemConfig } from '../../api/system.service';
import {
  FETCH_SYSTEM_SETUP,
  SHOW_SUCCESS_MSG,
  SHOW_ERROR_MSG,
} from '../actions';

@Module
export default class System extends VuexModule {
  config: SystemConfig = { jira: false, registration: true, saml: false };

  message: Message = {
    text: '',
    title: '',
    type: '',
    icon: '',
  };

  @Mutation
  [SET_CONFIG](config: SystemConfig) {
    this.config = config;
  }

  @Mutation
  [SET_MESSAGE](msg: APIMessage) {
    this.message.text = Array.isArray(msg.text) ? msg.text[0] : msg.text;
    this.message.type = msg.type;
    this.message.title = msg.title;
    this.message.icon = msg.type === 'success' ? 'fa-check' : 'fa-times';
  }

  @Action
  [SHOW_SUCCESS_MSG](text: string) {
    this.context.commit(SET_MESSAGE, {
      text,
      type: 'success',
      title: 'Success',
    });
  }

  @Action
  [SHOW_ERROR_MSG](text: string) {
    this.context.commit(SET_MESSAGE, {
      text,
      type: 'error',
      title: 'Error',
    });
  }

  @Action
  async [FETCH_SYSTEM_SETUP]() {
    const { data } = await getSystemConfig();
    this.context.commit(SET_CONFIG, data);
  }
}

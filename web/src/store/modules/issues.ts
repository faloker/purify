import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators';
import {
  getIssues,
  updateIssues,
  createTicket,
  postComment,
  getComments,
} from '@/api/issues.service';
import { SET_ISSUES, SET_COMMENTS } from '../mutations';
import {
  ISSUES_FETCH,
  ISSUE_UPDATE,
  CREATE_TICKET,
  POST_COMMENT,
  GET_COMMENTS,
} from '../actions';
import {
  Issue,
  Comment,
  EditIssueDto,
  CreateTicketDto,
  PostCommentDto,
} from '../types';

@Module
export default class Issues extends VuexModule {
  items: Issue[] = [];
  comments: Comment[] = [];

  @Mutation
  [SET_ISSUES](issues: Issue[]) {
    this.items = issues;
  }

  @Mutation
  [SET_COMMENTS](comments: Comment[]) {
    this.comments = comments;
  }

  @Action
  async [ISSUES_FETCH]() {
    const { data } = await getIssues(this.context.rootState.system.unitName);
    this.context.commit(SET_ISSUES, data);
  }

  @Action
  async [ISSUE_UPDATE](payload: EditIssueDto) {
    await updateIssues(payload.ids, payload.change);
    this.context.dispatch(ISSUES_FETCH);
  }

  @Action
  async [CREATE_TICKET](payload: CreateTicketDto) {
    const { data } = await createTicket(payload.issueId, payload.fields);
    this.context.dispatch(ISSUES_FETCH);
    return data;
  }

  @Action
  async [POST_COMMENT](payload: PostCommentDto) {
    await postComment(payload.issueId, payload.comment);
    this.context.dispatch(GET_COMMENTS, payload.issueId);
  }

  @Action
  async [GET_COMMENTS](issueId: string) {
    const { data } = await getComments(issueId);
    this.context.commit(SET_COMMENTS, data);
  }
}

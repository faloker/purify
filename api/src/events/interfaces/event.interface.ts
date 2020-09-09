import { Document } from 'mongoose';
import { User } from 'src/users/interfaces/user.interface';
import { Project } from 'src/projects/interfaces/project.interface';

export interface Event extends Document {
  readonly _id: string;
  readonly body: string;
  readonly audience: Audience;
  readonly type: EventType;
  readonly byUser: string | User;
  readonly project: string | Project;
}

export enum Audience {
  OWNERS = 'owners',
  ALL = 'all',
}

export enum EventType {
  PROJECT_CREATED = 'project_created',
  PROJECT_DELETED = 'project_deleted',
  USER_CREATED = 'user_created',
  USER_DELETED = 'user_deleted',
  TICKET_CREATED = 'ticket_created',
  ISSUE_RESOLVED = 'issue_resolved',
  COMMENT_CREATED = 'comment_created',
}
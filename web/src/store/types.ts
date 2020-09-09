export interface SystemConfig {
  jira: boolean;
  registration: boolean;
  saml: boolean;
}

export interface Message {
  text: string;
  title: string;
  type: string;
  icon: string;
}

export interface APIMessage {
  text: string | string[];
  title: string;
  type: string;
}

export interface Credentials {
  username: string;
  password: string;
}

export interface Project {
  _id: string;
  displayName: string;
  description: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  numUnits: number;
  numIssues: number;
  numTickets: number;
}

export interface CreateProjectDto {
  name: string;
  displayName: string;
  description: string;
}

export interface EditProjectDto extends CreateProjectDto {
  name: string;
  change: CreateProjectDto;
}

export interface AddUserDto {
  projectName: string;
  userId: string;
}

export interface FetchMetricsDto {
  days: number;
}

export interface Unit {
  _id: string;
  name: string;
  displayName: string;
  project: string;
  createdAt: Date;
  updatedAt: Date;
  numReports: number;
  numIssues: number;
  numTickets: number;
  numClosedIssues: number;
  progress?: number;
}

export interface CreateUnitDto {
  displayName: string;
  name: string;
}

// eslint-disable-next-line
export interface EditUnitDto extends CreateUnitDto {}

export interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
  role: Role;
  ssoBypass: boolean;
  memberships: string[];
  recentProjects: string[];
}

export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  OBSERVER = 'observer',
}

export interface BodyField {
  key: string;
  type: string;
}

export interface Template {
  _id: string;
  name: string;
  displayName: string;
  pathToIssues: string;
  titleFields: string[];
  bodyFields: BodyField[];
  riskField: string;
  internalComparisonFields: string[];
  externalComparisonFields: string[];
  mergeFields: string[];
  titlePattern: string;
  subtitlePattern: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateWithStats extends Template {
  numIssues: number;
  numReports: number;
}

interface Statistics {
  old: number;
  new: number;
}

export interface Report {
  _id: string;
  content: any;
  statistics: Statistics;
  unit: string;
  type: string;
  template: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EditTemplateDto {
  name: string;
  change: Template;
}

export interface Ticket {
  _id: string;
  type: string;
  link: string;
  key: string;
}
export interface Issue {
  _id: string;
  fields: string;
  title: string;
  subtitle: string;
  status: string;
  resolution: string;
  risk: string;
  template: Template | string;
  report: Report | string;
  ticket: Ticket | string;
  unit: Unit | string;
  tags: string[];
  comments: Comment[] | string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface EditIssueDto {
  ids: string[];
  change: any;
  unitId: string;
}

export interface CreateTicketDto {
  issueId: string;
  fields: any;
  unitId: string;
}

export interface PostCommentDto {
  issueId: string;
  comment: Comment;
}

export interface Comment {
  _id: string;
  text: string;
  author: string | User;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FilterOption {
  name: string;
  value: string;
}

export interface FilterValue {
  title: string;
  total: number;
  value: number;
}

export interface ChangePasswordDto {
  password: string;
  token: string;
}

export interface GetEventsDto {
  days: number;
}

export interface Event {
  readonly _id: string;
  body: any;
  readonly audience: Audience;
  readonly type: EventType;
  readonly byUser: string | User;
  readonly project?: string | Project;
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

export interface GetIssuesQueryDto {
  readonly status?: string;
  readonly ticket?: string;
  readonly risks?: string;
  readonly projectName?: string;
  readonly unitName?: string;
  readonly limit?: string;
  readonly days?: string;
}

export interface UserSelfChange {
  readonly trackMe?: string;
}

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
  title: string;
  subtitle: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
  units: number;
  issues: number;
  tickets: number;
}

export interface CreateProjectDto {
  title: string;
  subtitle: string;
}

export interface EditProjectDto extends CreateProjectDto {
  slug: string;
  change: CreateProjectDto;
}

export interface Unit {
  _id: string;
  name: string;
  slug: string;
  project: string;
  created_at: Date;
  updated_at: Date;
  reports: number;
  closed_tickets: number;
  tickets: number;
  progress?: number;
}

export interface CreateUnitDto {
  name: string;
  project: string;
}

export interface DeleteUnitDto {
  slug: string;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  image: string;
}

interface BodyField {
  key: string;
  type: string;
}

export interface Template {
  _id: string;
  slug: string;
  name: string;
  path_to_issues: string;
  title_fields: string[];
  body_fields: BodyField[];
  risk_field: string;
  internal_comparison_fields: string[];
  external_comparison_fields: string[];
  merge_fields: string[];
  title_pattern: string;
  subtitle_pattern: string;
  tags: string[];
  created_at: Date;
  updated_at: Date;
}

export interface TemplateWithStats {
  issues: number;
  reports: number;
  template: Template;
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
  created_at: Date;
  updated_at: Date;
}

export interface EditTemplateDto {
  slug: string;
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
  status: string;
  resolution: string;
  risk: string;
  template: Template | string;
  report: Report | string;
  ticket: Ticket | string;
  unit: Unit | string;
  tags: string[];
  comments: Comment[] | string[];
  created_at: Date;
  updated_at: Date;
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
  created_at?: Date;
  updated_at?: Date;
}

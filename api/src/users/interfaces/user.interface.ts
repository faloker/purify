import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  name: string;
  email: string;
  image: string;
  password: string;
  readonly token: string;
  readonly salt: string;
  readonly refreshToken: string;
  readonly role: Role;
  readonly ssoBypass: boolean;
  memberships: string[];
  recentProjects: string[];
}

export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  OBSERVER = 'observer',
}

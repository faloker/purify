import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly name: string;
  readonly email: string;
  readonly image: string;
  readonly password: string;
  readonly token: string;
  readonly salt: string;
  readonly refreshToken: string;
  readonly role: Role;
  readonly ssoBypass: boolean;
  readonly membership: string[];
}

export enum Role {
  OWNER = 'owner',
  ADMIN = 'admin',
  USER = 'user',
  OBSERVER = 'observer',
}
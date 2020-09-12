import { Document } from 'mongoose';
import { User } from './user.interface';

export interface Token extends Document {
  readonly _id: string;
  readonly type: string;
  readonly name?: string;
  readonly value: string;
  lastActivity?: Activity;
  readonly user: string | User;
}

export enum TokenType {
  REFRESH_TOKEN = 'refresh',
  API_ACCESS_TOKEN = 'api',
  INVITE_TOKEN = 'invite',
}

interface Activity {
  date: Date;
  fromIP: String;
  userAgent: String;
}

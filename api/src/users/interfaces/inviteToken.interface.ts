import { Document } from 'mongoose';
import { User } from './user.interface';

export interface InviteToken extends Document {
  readonly _id: string;
  readonly value: string;
  readonly user: string | User;
}

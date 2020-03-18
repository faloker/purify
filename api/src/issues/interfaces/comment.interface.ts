import { Document } from 'mongoose';
import { User } from '../../users/interfaces/user.interface';

export interface Comment extends Document {
  readonly _id: string;
  readonly text: string;
  readonly author: string | User;
}
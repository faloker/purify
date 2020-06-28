import { Document } from 'mongoose';

export interface User extends Document {
  readonly _id: string;
  readonly username: string;
  readonly email: string;
  readonly image: string;
  readonly password: string;
  readonly token: string;
  readonly salt: string;
  readonly type: string;
  readonly refresh_token: string;
}

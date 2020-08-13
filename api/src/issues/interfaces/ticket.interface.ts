import { Document } from 'mongoose';

export interface Ticket extends Document {
  readonly _id: string;
  readonly type: string;
  readonly link: string;
  readonly key: string;
}

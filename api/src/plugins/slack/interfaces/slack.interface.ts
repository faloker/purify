import { Document } from 'mongoose';

export interface SlackSettings extends Document {
  readonly _id: string;
  webhook: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

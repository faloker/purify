import { Document } from 'mongoose';

export interface SMTPSettings extends Document {
  readonly _id: string;
  config: any;
  readonly created_at: Date;
  readonly updated_at: Date;
}

import { Document } from 'mongoose';

export interface JiraSettings extends Document {
  readonly _id: string;
  host: string;
  username: string;
  api_key: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

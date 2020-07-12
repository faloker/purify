import { Document } from 'mongoose';

export interface Project extends Document {
  readonly _id: string;
  readonly title: string;
  readonly subtitle: string;
  readonly slug: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

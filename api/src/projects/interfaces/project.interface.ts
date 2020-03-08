import { Document } from 'mongoose';

export interface Project extends Document {
  readonly _id: string;
  title: string;
  subtitle: string;
  readonly slug: string;
}

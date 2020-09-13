import { Document } from 'mongoose';

export interface Project extends Document {
  readonly _id: string;
  readonly name: string;
  readonly displayName: string;
  readonly description: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

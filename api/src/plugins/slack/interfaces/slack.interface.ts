import { Document } from 'mongoose';

export interface SlackSettings extends Document {
  readonly _id: string;
  webhook: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

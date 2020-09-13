import { Document } from 'mongoose';

export interface SMTPSettings extends Document {
  readonly _id: string;
  config: any;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

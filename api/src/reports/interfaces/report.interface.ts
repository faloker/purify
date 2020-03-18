import { Document } from 'mongoose';

interface Statistics {
  old: number;
  new: number;
}

export interface Report extends Document {
  readonly _id: string;
  readonly content: any;
  statistics: Statistics;
  readonly unit: string;
  template: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

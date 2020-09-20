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
  readonly project: string;
  readonly type: string;
  template: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export enum ReportType {
  ONESHOT = 'oneshot',
  FILE = 'file',
}

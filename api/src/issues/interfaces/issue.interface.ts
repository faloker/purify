import { Document } from 'mongoose';
import { Unit } from '../../units/interfaces/unit.interface';

export interface Issue extends Document {
  readonly _id: string;
  readonly fields: any;
  readonly is_closed: boolean;
  readonly is_fp: boolean;
  readonly dup_score: number;
  readonly risk: string;
  readonly template: string;
  readonly report: string;
  readonly ticket: string;
  readonly unit: Unit;
  readonly tags: string[];
  readonly comments: string[];
  readonly created_at: Date;
  readonly updated_at: Date;
}
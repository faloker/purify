import { Document } from 'mongoose';
import { Unit } from 'src/units/interfaces/unit.interface';
import { Template } from 'src/templates/interfaces/template.interface';

interface Statistics {
  old: number;
  new: number;
}

export interface Report extends Document {
  readonly _id: string;
  readonly content: any;
  readonly statistics: Statistics;
  readonly unit: Unit;
  readonly template: Template;
  readonly created_at: Date;
  readonly updated_at: Date;
}

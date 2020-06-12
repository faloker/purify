import { Document } from 'mongoose';
import { Unit } from '../../units/interfaces/unit.interface';
import { Ticket } from './ticket.interface';
import { Template } from 'src/templates/interfaces/template.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { Comment } from 'src/issues/interfaces/comment.interface';

export interface Issue extends Document {
  readonly _id: string;
  fields: string;
  readonly status: string;
  readonly resolution: string;
  readonly risk: string;
  readonly template: Template;
  readonly report: Report;
  readonly ticket: Ticket;
  readonly unit: Unit;
  readonly tags: string[];
  readonly comments: Comment[];
  readonly created_at: Date;
  readonly updated_at: Date;
}
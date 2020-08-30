import { Document } from 'mongoose';
import { Unit } from '../../units/interfaces/unit.interface';
import { Ticket } from './ticket.interface';
import { Template } from 'src/templates/interfaces/template.interface';
import { Report } from 'src/reports/interfaces/report.interface';
import { Comment } from 'src/issues/interfaces/comment.interface';
import { Project } from 'src/projects/interfaces/project.interface';

export interface Issue extends Document {
  readonly _id: string;
  fields: string;
  readonly status: string;
  readonly resolution: string;
  readonly risk: string;
  readonly template: Template | string;
  readonly report: Report | string;
  readonly ticket: Ticket | string;
  readonly unit: Unit | string;
  readonly project: Project | string;
  readonly tags: string[];
  readonly comments: Comment[] | string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

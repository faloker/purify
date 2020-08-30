import { Document } from 'mongoose';
import { Project } from '../../projects/interfaces/project.interface';

export interface Unit extends Document {
  readonly _id: string;
  readonly name: string;
  readonly displayName: string;
  readonly project: string | Project;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly numIssues?: number;
  readonly numTickets?: number;
  readonly numReports?: number;
}

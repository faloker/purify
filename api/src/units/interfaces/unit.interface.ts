import { Document } from 'mongoose';
import { Project } from '../../projects/interfaces/project.interface';

export interface Unit extends Document {
  readonly _id: string;
  readonly name: string;
  readonly slug: string;
  readonly project: string | Project;
}

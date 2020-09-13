import { Document } from 'mongoose';

export interface BodyField {
  key: string;
  type: string;
}

export interface Template extends Document {
  readonly _id: string;
  readonly name: string;
  readonly displayName: string;
  readonly pathToIssues: string;
  readonly titleFields: string[];
  readonly bodyFields: BodyField[];
  readonly riskField: string;
  readonly internalComparisonFields: string[];
  readonly externalComparisonFields: string[];
  readonly mergeFields: string[];
  readonly titlePattern: string;
  readonly subtitlePattern: string;
  readonly tags: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

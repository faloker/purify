/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const TemplateSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    name: { type: String, unique: true },
    displayName: String,
    pathToIssues: String,
    riskField: String,
    titleFields: Array,
    internalComparisonFields: Array,
    externalComparisonFields: Array,
    bodyFields: Array,
    mergeFields: Array,
    titlePattern: String,
    subtitlePattern: String,
    tags: [{ type: String }],
  },
  { timestamps: true }
);

TemplateSchema.virtual('numIssues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'template',
  count: true,
});

TemplateSchema.virtual('numReports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'template',
  count: true,
});

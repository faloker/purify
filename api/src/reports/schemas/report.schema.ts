/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const ReportSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    content: Object,
    statistics: Object,
    unit: { type: String, ref: 'Unit' },
    project: { type: String, ref: 'Project' },
    template: { type: String, ref: 'Template' },
    type: {
      type: String,
      enum: ['file', 'oneshot'],
    },
  },
  { timestamps: true }
);

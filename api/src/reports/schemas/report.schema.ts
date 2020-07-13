/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const ReportSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    content: Object,
    statistics: Object,
    unit: { type: String, ref: 'Unit' },
    template: { type: String, ref: 'Template' },
    type: {
      type: String,
      enum: ['file', 'oneshot'],
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

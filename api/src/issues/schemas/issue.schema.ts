/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const IssueSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    fields: Object,
    is_closed: { type: Boolean, default: false },
    is_fp: { type: Boolean, default: false },
    dup_score: Number,
    risk: {
      type: String,
      default: 'Medium',
      enum: ['Low', 'Info', 'Medium', 'High', 'Critical'],
    },
    template: { type: String, ref: 'Template' },
    report: { type: String, ref: 'Report' },
    ticket: { type: String, ref: 'Ticket' },
    unit: { type: String, ref: 'Unit' },
    tags: [{ type: String }],
    comments: [{ type: String, ref: 'Comment' }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

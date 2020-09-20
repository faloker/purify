/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const IssueSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    fields: String,
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    resolution: {
      type: String,
      enum: ['false positive', 'accepted risk', 'resolved', 'none'],
      default: 'none',
    },
    risk: {
      type: String,
      default: 'medium',
      enum: ['low', 'info', 'medium', 'high', 'critical'],
    },
    template: { type: String, ref: 'Template' },
    report: { type: String, ref: 'Report' },
    ticket: { type: String, ref: 'Ticket' },
    unit: { type: String, ref: 'Unit' },
    project: { type: String, ref: 'Project' },
    tags: [{ type: String }],
    comments: [{ type: String, ref: 'Comment' }],
    closedAt: Date,
  },
  { timestamps: true }
);

IssueSchema.index({ status: 1 });
IssueSchema.index({ resolution: 1 });
IssueSchema.index({ risk: 1 });
IssueSchema.index({ unit: 1 });
IssueSchema.index({ project: 1 });
IssueSchema.index({ template: 1 });
IssueSchema.index({ createdAt: -1 });

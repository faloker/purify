import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';
import { match } from 'assert';

export const UnitSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    name: { type: String, unique: true },
    displayName: String,
    project: { type: String, ref: 'Project' },
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

UnitSchema.virtual('numIssues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'unit',
  count: true,
});

UnitSchema.virtual('numClosedIssues', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'unit',
  match: { status: 'closed' },
  count: true,
});

UnitSchema.virtual('numTickets', {
  ref: 'Issue',
  localField: '_id',
  foreignField: 'unit',
  match: { ticket: { $exists: true } },
  count: true,
});

UnitSchema.virtual('numReports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'unit',
  count: true,
});

import { Schema, model } from 'mongoose';
import uuid from 'node-uuid';

const issue = new Schema(
  {
    _id: { type: String, default: uuid.v4 },
    fields: Object,
    is_closed: { type: Boolean, default: false },
    is_fp: { type: Boolean, default: false },
    dup_score: Number,
    risk: { type: String, default: 'Medium' },
    template: { type: String, ref: 'Template' },
    report: { type: String, ref: 'Report' },
    ticket: { type: String, ref: 'Ticket' },
    unit: { type: String, ref: 'Unit' },
    tags: [{ type: String }],
    comments: [{ type: String, ref: 'Comment' }],
    date: Date,
  },
  { versionKey: false },
);

const Issue = model('Issue', issue);

export default Issue;

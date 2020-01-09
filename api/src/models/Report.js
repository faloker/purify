import { Schema, model } from 'mongoose';
import uuid from 'node-uuid';

const report = new Schema(
  {
    _id: { type: String, default: uuid.v4 },
    date: Date,
    content: Object,
    statistics: {
      old: Number,
      new: Number,
    },
    unit: { type: String, ref: 'Unit' },
    template: { type: String, ref: 'Template' },
  },
  { versionKey: false },
);

const Report = model('Report', report);

export default Report;

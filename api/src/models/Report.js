import { Schema, model } from 'mongoose';
import uuid from 'node-uuid';

const report = new Schema(
  {
    _id: { type: String, default: uuid.v4 },
    content: Object,
    statistics: {
      old: Number,
      new: Number,
    },
    unit: { type: String, ref: 'Unit' },
    template: { type: String, ref: 'Template' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Report = model('Report', report);

export default Report;

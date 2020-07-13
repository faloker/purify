import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const UnitSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: String,
    slug: { type: String, lowercase: true, unique: true },
    project: { type: String, ref: 'Project' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

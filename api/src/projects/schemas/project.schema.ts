import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const ProjectSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: String,
    subtitle: String,
    slug: { type: String, lowercase: true, unique: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

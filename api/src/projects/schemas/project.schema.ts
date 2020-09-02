import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const ProjectSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    description: String,
    displayName: String,
    name: { type: String, unique: true },
  },
  { timestamps: true }
);

import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '../../db/plugins';

const ProjectSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    title: String,
    subtitle: String,
    slug: { type: String, lowercase: true, unique: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

ProjectSchema.plugin(slugify);

export { ProjectSchema };

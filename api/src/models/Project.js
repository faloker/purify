import { Schema, model } from 'mongoose';
import uuid from 'node-uuid';
import slugify from '../plugins/db/middleware';

const projectSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  title: String,
  subtitle: String,
  slug: { type: String, lowercase: true, unique: true },
});

projectSchema.plugin(slugify);

const Project = model('Project', projectSchema);

export default Project;

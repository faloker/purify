import { Schema, model } from 'mongoose';
import uuid from 'node-uuid';

const template = new Schema({
  _id: { type: String, default: uuid.v4 },
  name: { type: String, unique: true },
  path_to_issues: String,
  title_fields: Array,
  compare_fields: Array,
  body_fields: Array,
  merge_fields: Array,
  title_pattern: String,
  subtitle_pattern: String,
  tags: [{ type: String }],
});

const Template = model('Template', template);

export default Template;

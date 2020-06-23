/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const TemplateSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, unique: true },
    path_to_issues: String,
    risk_field: String,
    title_fields: Array,
    internal_comparison_fields: Array,
    external_comparison_fields: Array,
    body_fields: Array,
    merge_fields: Array,
    title_pattern: String,
    subtitle_pattern: String,
    tags: [{ type: String }],
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

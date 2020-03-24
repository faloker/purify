/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const JiraSettingsSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    host: String,
    username: String,
    api_key: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

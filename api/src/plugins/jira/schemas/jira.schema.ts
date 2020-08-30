/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const JiraSettingsSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    host: String,
    username: String,
    api_key: String,
  },
  { timestamps: true }
);

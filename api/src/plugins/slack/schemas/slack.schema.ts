/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const SlackSettingsSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    webhook: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

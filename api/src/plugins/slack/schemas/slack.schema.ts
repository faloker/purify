/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const SlackSettingsSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    webhook: { type: String, required: true },
  },
  { timestamps: true }
);

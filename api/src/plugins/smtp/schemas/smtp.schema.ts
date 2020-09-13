/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const SMTPSettingsSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    config: Object,
  },
  { timestamps: true }
);

/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const CommentSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    text: String,
    author: { type: String, ref: 'User' },
  },
  { timestamps: true }
);

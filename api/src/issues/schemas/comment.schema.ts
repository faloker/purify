/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const CommentSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    text: String,
    author: { type: String, ref: 'User' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

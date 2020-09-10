import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const TokenSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    name: String,
    value: {
      type: String,
      unique: true,
      required: true,
      default: () => nanoid(30),
    },
    type: { type: String, enum: ['refresh', 'api', 'invite'], required: true },
    user: { type: String, ref: 'User' },
    lastActivity: {
      date: Date,
      fromIP: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

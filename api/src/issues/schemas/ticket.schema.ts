/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const TicketSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    type: { type: String, required: true },
    link: { type: String, required: true },
    key: { type: String, required: true },
  },
  { timestamps: true }
);

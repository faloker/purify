/* eslint-disable @typescript-eslint/camelcase */
import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const TicketSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    type: { type: String, required: true },
    link: { type: String, required: true },
    key: { type: String, required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } },
);

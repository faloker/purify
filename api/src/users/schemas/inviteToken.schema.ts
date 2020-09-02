import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

export const InviteTokenSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  value: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(30),
  },
  user: { type: String, ref: 'User' },
});

import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';

export const InviteTokenSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  value: {
    type: String,
    unique: true,
    required: true,
    default: () => nanoid(),
  },
  user: { type: String, ref: 'User' },
});

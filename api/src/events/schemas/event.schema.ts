import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const EventSchema = new Schema(
  {
    _id: { type: String, default: () => nanoid() },
    type: {
      type: String,
      enum: [
        'project_created',
        'project_deleted',
        'user_created',
        'user_deleted',
        'ticket_created',
        'issue_resolved',
      ],
    },
    body: String,
    audience: { type: String, enum: ['owners', 'all'], default: 'all' },
    byUser: { type: String, ref: 'User' },
    project: { type: String, ref: 'Project' },
  },
  { timestamps: true }
);

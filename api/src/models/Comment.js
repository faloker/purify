import mongoose from 'mongoose';
import uuid from 'node-uuid';

const CommentSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid.v4 },
    text: String,
    date: Date,
    author: { type: String, ref: 'User' },
  },
  { versionKey: false },
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;

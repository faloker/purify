import mongoose from 'mongoose';
import uuid from 'node-uuid';

const CommentSchema = mongoose.Schema(
  {
    _id: { type: String, default: uuid.v4 },
    text: String,
    author: { type: String, ref: 'User' }
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;

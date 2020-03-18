import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const UserSchema = new Schema({
  _id: { type: String, default: uuidv4 },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can`t be blank'],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, 'can`t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  image: String,
  password: String,
  token: String,
  salt: String,
  // eslint-disable-next-line @typescript-eslint/camelcase
  refresh_token: String,
});

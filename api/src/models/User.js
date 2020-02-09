import { Schema, model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import uuid from 'node-uuid';

const UserSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  username: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/^[a-zA-Z0-9]+$/, 'is invalid']
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
    match: [/\S+@\S+\.\S+/, 'is invalid']
  },
  image: String,
  password: String,
  token: String,
  salt: {
    type: String,
    default: randomBytes(16).toString('hex')
  },
  theme: { type: String, default: '' }
});

UserSchema.methods.validSecret = function(secret, field) {
  const hash = pbkdf2Sync(secret, this.salt, 10000, 512, 'sha512').toString(
    'hex'
  );
  return this[field] === hash;
};

UserSchema.methods.setSecret = function(secret, field) {
  this[field] = pbkdf2Sync(secret, this.salt, 10000, 512, 'sha512').toString(
    'hex'
  );
};

const Users = model('User', UserSchema);

export default Users;

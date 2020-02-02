import { Schema, model } from 'mongoose';
import { pbkdf2Sync, randomBytes } from 'crypto';
import uuid from 'node-uuid';

const UserSchema = new Schema({
  _id: { type: String, default: uuid.v4 },
  username: {
    type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/^[a-zA-Z0-9]+$/, 'is invalid'],
  },
  email: {
    type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'],
  },
  image: String,
  hash: String,
  salt: String,
  theme: { type: String, default: '' },
  token: String,
}, { versionKey: false });


UserSchema.methods.validPassword = function (password) {
  const hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = randomBytes(16).toString('hex');
  this.hash = pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    image: `https://api.adorable.io/avatars/285/${this.username}.png`,
    token: this.generateJWT(),
  };
};

UserSchema.methods.toProfileJSONFor = function () {
  return {
    username: this.username,
    email: this.email,
    image: `https://api.adorable.io/avatars/285/${this.username}.png`,
  };
};

const Users = model('User', UserSchema);

export default Users;

import { Schema } from 'mongoose';
import { nanoid } from 'nanoid';

export const UserSchema = new Schema({
  _id: { type: String, default: () => nanoid() },
  name: String,
  email: {
    type: String,
    unique: true,
    required: true,
  },
  image: {
    type: String,
  },
  password: String,
  token: String,
  salt: String,
  ssoBypass: Boolean,
  refreshToken: String,
  type: {
    type: String,
    enum: ['local', 'ldap', 'saml'],
    default: 'local',
  },
  role: {
    type: String,
    enum: ['owner', 'admin', 'user', 'observer'],
    required: true,
  },
  memberships: [{ type: String, ref: 'Project' }],
  recentProjects: [{ type: String }],
});

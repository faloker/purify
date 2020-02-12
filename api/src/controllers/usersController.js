import boom from '@hapi/boom';
import { randomBytes, pbkdf2Sync } from 'crypto';

import User from '../models/User';

export const createUser = async (req, reply) => {
  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    image: `https://api.adorable.io/avatars/285/${username}.png`,
  });

  user.setSecret(password, 'password');

  const u = await user.save();

  reply.jwtSign({ id: u._id, username }, { expiresIn: '1d' }, (err, token) =>
    reply.code(201).send(err || { token })
  );
};

export const authUser = async (req, reply) => {
  const token = await req.jwtVerify();

  const user = await User.findOne({ _id: token.id });
  reply.code(200).send(user);
};

export const loginUser = async (req, reply) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !user.validSecret(password, 'password')) {
    throw boom.unauthorized('Username or password is invalid');
  }

  reply.jwtSign({ id: user._id }, { expiresIn: '1d' }, (err, token) => {
    reply.code(200).send(err || { ...user._doc, token });
  });
};

export const createToken = async (req, reply) => {
  const token = randomBytes(16).toString('hex');
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !user.validSecret(password, 'password')) {
    throw boom.unauthorized('Username or password is invalid');
  }

  const secret = pbkdf2Sync(token, user.salt, 10000, 512, 'sha512').toString(
    'hex'
  );

  await User.updateOne({ username }, { $set: { token: secret } });
  reply
    .code(201)
    .send({ token: Buffer.from(`${username}:${token}`).toString('base64') });
};

export const verifyToken = async (username, token) => {
  const user = await User.findOne({ username });

  if (!user || !user.validSecret(token, 'token')) {
    throw boom.unauthorized('Username or token is invalid');
  }
};

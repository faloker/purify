import boom from '@hapi/boom';
import { randomBytes } from 'crypto';
import User from '../models/User';

const createUser = async (req, reply) => {
  const { username, email, password } = req.body;

  const user = new User({
    username,
    email,
    image: `https://api.adorable.io/avatars/285/${username}.png`,
  });

  user.setPassword(password);

  const u = await user.save();

  reply.jwtSign({ id: u._id, username }, { expiresIn: '1d' }, (err, token) => reply.code(201).send(err || { token }));
};

const authUser = async (req, reply) => {
  const token = await req.jwtVerify();

  const user = await User.findOne({ _id: token.id });
  reply.code(200).send(user);
};

const loginUser = async (req, reply) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !user.validPassword(password)) {
    throw boom.unauthorized('Username or password is invalid');
  }

  reply.jwtSign({ id: user._id }, { expiresIn: '1d' }, (err, token) => {
    reply.code(200).send(err || { ...user._doc, token });
  });
};

const createToken = async (req, reply) => {
  const token = randomBytes(16).toString('hex');

  await User.findOneAndUpdate({ _id: req.user.id }, { $set: { token } });
  reply.code(201).send({ token });
};

const verifyToken = async (token) => {
  const user = await User.findOne({ token });
  if (!user) {
    throw boom.unauthorized('Token is invalid');
  }
};

export default {
  createUser,
  authUser,
  loginUser,
  createToken,
  verifyToken,
};

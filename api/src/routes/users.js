import {
  createUser,
  authUser,
  loginUser,
  createToken,
} from '../controllers/usersController';
import docs from './documentation';

export default (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/signup',
    handler: createUser,
    schema: docs.users.create,
  });

  fastify.route({
    method: 'GET',
    url: '/auth',
    handler: authUser,
    schema: docs.users.auth,
  });

  fastify.route({
    method: 'POST',
    url: '/login',
    handler: loginUser,
    schema: docs.users.login,
  });

  fastify.route({
    method: 'POST',
    url: '/token',
    handler: createToken,
    schema: docs.users.createToken,
  });

  done();
};

import usersController from '../../controllers/usersController';
import docs from '../documentation';

export default ((fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/signup',
    handler: usersController.createUser,
    schema: docs.users.create,
  });

  fastify.route({
    method: 'GET',
    url: '/auth',
    handler: usersController.authUser,
    schema: docs.users.auth,
  });

  fastify.route({
    method: 'POST',
    url: '/login',
    handler: usersController.loginUser,
    schema: docs.users.login,
  });

  fastify.route({
    method: 'POST',
    url: '/tokens',
    handler: usersController.createToken,
    schema: docs.users.createToken,
  });

  done();
});

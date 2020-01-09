import boom from '@hapi/boom';
import fs from 'fs';
import { randomBytes } from 'crypto';
import dotenv from 'dotenv';

const fastify = require('fastify')({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

dotenv.config();

const mongoose = require('mongoose');

const routes = require('./routes');
const schemas = require('./schemas');

const swagger = require('./config/swagger');

fastify.register(require('fastify-swagger'), swagger.options);
fastify.register(require('fastify-file-upload'));
fastify.register(require('fastify-boom'));
fastify.register(require('fastify-cors'));


fastify.register(require('fastify-jwt'), {
  secret: randomBytes(40).toString('hex'),
});

fastify.decorate('authenticate', async (request, reply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw boom.unauthorized('You are not authorized');
  }
});

fastify.addHook('onRequest', async (req, reply) => {
  const publicEndpoints = ['/api/login', '/api/auth', '/api/signup', '/documentation', '/css', '/js', '/img', '/fonts'];
  const isPublic = publicEndpoints.filter((endpoint) => req.raw.url.includes(endpoint)).length;

  if (!(isPublic || req.raw.url === '/')) {
    try {
      await req.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  }
});

let mongoUrl = 'mongodb://localhost:27017/purify';

if (process.env.NODE_ENV === 'production') {
  fastify.register(require('fastify-static'), {
    root: '/home/node/app/static',
  });
  mongoUrl = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/admin`;
}

mongoose.connect(mongoUrl, { useNewUrlParser: true })
  .then(() => fastify.log.info('Connection to mongo established ...'))
  .catch((err) => fastify.log.error(err));

routes.forEach((route, index) => {
  fastify.route(route);
});

schemas.forEach((schema, index) => {
  fastify.addSchema(schema);
});

fastify.addHook('onError', async (request, reply, error) => {
  fastify.log.error(error);
});

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0');
    fastify.swagger();
    fastify.log.info(`Server is up on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

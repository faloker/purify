import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export default fp(async (fastify, opts, done) => {
  let uri = `mongodb://${opts.host}:${opts.port}/purify`;

  if (process.env.NODE_ENV === 'production') {
    uri = `mongodb://${opts.user}:${opts.password}@${opts.host}:${opts.port}/admin`;
  } else if (process.env.NODE_ENV === 'heroku') {
    uri = process.env.MONGO_URI;
  }

  mongoose
    .connect(uri, opts.settings)
    .then(connection => {
      fastify.decorate('db', connection);
      fastify.log.info('[MongoDB] Connection established');
      done();
    })
    .catch(err => {
      fastify.log.error(`[MongoDB] Failed to connect:\n ${err}`);
      process.exit(1);
    });
});

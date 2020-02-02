import fp from 'fastify-plugin';
import mongoose from 'mongoose';

export default fp(async (fastify, opts, done) => {
  let uri = 'mongodb://localhost:27017/purify';

  if (process.env.NODE_ENV === 'production') {
    // Host static files for production use
    fastify.register(require('fastify-static'), {
      root: '/home/node/app/static',
    });
    uri = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@mongo:27017/admin`;
  }

  mongoose.connect(
    uri,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    },
  )
    .then((connection) => {
      fastify.decorate('db', connection);
      fastify.log.info('Connection to mongo established ...');
      done();
    })
    .catch((err) => fastify.log.error(err));
});

import dotenv from 'dotenv';
import { randomBytes } from 'crypto';

import reportsRoutes from './routes/reports';
import projectsRoutes from './routes/projects';
import issuesRoutes from './routes/issues';
import templatesRoutes from './routes/templates';
import usersRoutes from './routes/users';
import unitsRoutes from './routes/units';
import db from './plugins/db';
import addSchemas from './schemas';

import authHooks from './hooks/auth';
import loggerHooks from './hooks/logger';
import mountCrons from './plugins/cron';

const fastify = require('fastify')({
  logger: {
    level: 'info',
    prettyPrint: true,
  },
});

// Read .env file from current directory
dotenv.config();

const swagger = require('./config/swagger');

// Register plugins
fastify.register(require('fastify-swagger'), swagger.options);
fastify.register(require('fastify-file-upload'));
fastify.register(require('fastify-boom'));
fastify.register(require('fastify-cors'));
fastify.register(require('fastify-helmet'));
fastify.register(require('fastify-jwt'), {
  secret: randomBytes(40).toString('hex'),
});

// Register API routes
fastify.register(reportsRoutes, { prefix: '/api/reports' });
fastify.register(projectsRoutes, { prefix: '/api/projects' });
fastify.register(issuesRoutes, { prefix: '/api/issues' });
fastify.register(templatesRoutes, { prefix: '/api/templates' });
fastify.register(usersRoutes, { prefix: '/api/users' });
fastify.register(unitsRoutes, { prefix: '/api/units' });

// Connect to mongodb
fastify.register(db);

// Register hooks
authHooks(fastify);
loggerHooks(fastify);

// Add schemes
addSchemas(fastify);

// Mount cron jobs
mountCrons(fastify);

fastify.listen(3000, '0.0.0.0', (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

import docs from '../documentation';
import projectController from '../../controllers/projectController';

export default (async (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: projectController.createProject,
    schema: docs.projects.create,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: projectController.fetchProjects,
  });

  fastify.route({
    method: 'GET',
    url: '/stats',
    handler: projectController.getStats,
  });

  done();
});

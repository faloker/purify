import docs from './documentation';
import {
  fetchProjects,
  getStats,
  createProject,
  deleteProject,
  editProject,
} from '../controllers/projectController';

export default async (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: createProject,
    schema: docs.projects.create,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: fetchProjects,
  });

  fastify.route({
    method: 'GET',
    url: '/stats',
    handler: getStats,
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: deleteProject,
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    handler: editProject,
  });

  done();
};

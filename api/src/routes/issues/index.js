import {
  fetchByUnit,
  updateIssues,
  createJiraTicket,
  postComment,
} from '../../controllers/issuesController';
import docs from '../documentation';

export default (fastify, opts, done) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: fetchByUnit,
    // schema: fetchByUnit,
  });

  fastify.route({
    method: 'PATCH',
    url: '/',
    handler: updateIssues,
  });

  fastify.route({
    method: 'POST',
    url: '/:id/jira',
    handler: createJiraTicket,
  });

  fastify.route({
    method: 'POST',
    url: '/:id/comment',
    handler: postComment,
    schema: docs.issues.postComment,
  });

  done();
};

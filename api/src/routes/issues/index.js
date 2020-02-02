import issuesController from '../../controllers/issuesController';
import docs from '../documentation';

export default ((fastify, opts, done) => {
  fastify.route({
    method: 'GET',
    url: '/',
    handler: issuesController.fetchByUnit,
    // schema: issuesController.fetchByUnit,
  });

  fastify.route({
    method: 'PATCH',
    url: '/',
    handler: issuesController.updateIssues,
  });

  fastify.route({
    method: 'POST',
    url: '/:id/jira',
    handler: issuesController.createJiraTicket,
  });

  fastify.route({
    method: 'POST',
    url: '/:id/comment',
    handler: issuesController.postComment,
    schema: docs.issues.postComment,
  });

  done();
});

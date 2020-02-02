import reportController from '../../controllers/reportController';
import docs from '../documentation';

export default (async (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: reportController.saveReport,
    schema: docs.reports.save,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: reportController.fetchReportsBySlug,
    schema: docs.reports.fetchByUnit,
  });

  fastify.route({
    method: 'GET',
    url: '/:id/content',
    handler: reportController.getContent,
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: reportController.deleteReport,
  });

  done();
});

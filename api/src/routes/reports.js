import {
  deleteReport,
  getContent,
  saveReport,
  fetchReportsBySlug,
} from '../controllers/reportController';
import docs from './documentation';

export default async (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: saveReport,
    schema: docs.reports.save,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: fetchReportsBySlug,
    schema: docs.reports.fetchByUnit,
  });

  fastify.route({
    method: 'GET',
    url: '/:id/content',
    handler: getContent,
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: deleteReport,
  });

  done();
};

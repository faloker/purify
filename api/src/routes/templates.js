import {
  saveTemplate,
  fetchTemplatesNames,
} from '../controllers/templatesController';
import docs from './documentation';

export default (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: saveTemplate,
    schema: docs.templates.save,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: fetchTemplatesNames,
  });

  done();
};

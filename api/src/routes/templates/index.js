import templatesController from '../../controllers/templatesController';
import docs from '../documentation';

export default ((fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: templatesController.saveTemplate,
    schema: docs.templates.save,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: templatesController.fetchTemplatesNames,
  });

  done();
});

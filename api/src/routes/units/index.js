import unitsController from '../../controllers/unitsController';
import docs from '../documentation';

export default ((fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: unitsController.createUnit,
    schema: docs.units.create,
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: unitsController.getUnitsByProjectSlug,
    schema: docs.units.getByProjectSlug,
  });

  done();
});

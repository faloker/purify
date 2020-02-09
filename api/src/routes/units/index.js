import {
  createUnit,
  getUnitsByProjectSlug,
  editUnit,
  deleteUnit
} from '../../controllers/unitsController';
import docs from '../documentation';

export default (fastify, opts, done) => {
  fastify.route({
    method: 'POST',
    url: '/',
    handler: createUnit,
    schema: docs.units.create
  });

  fastify.route({
    method: 'GET',
    url: '/',
    handler: getUnitsByProjectSlug,
    schema: docs.units.getByProjectSlug
  });

  fastify.route({
    method: 'PATCH',
    url: '/:id',
    handler: editUnit
  });

  fastify.route({
    method: 'DELETE',
    url: '/:id',
    handler: deleteUnit
  });

  done();
};

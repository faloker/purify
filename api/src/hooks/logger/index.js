export default fastify => {
  fastify.addHook('onError', async (request, reply, error) => {
    fastify.log.error(error);
  });
};

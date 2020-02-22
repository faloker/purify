import JiraClient from 'jira-connector';
import fp from 'fastify-plugin';

export default fp(async (fastify, opts, done) => {
  const client = new JiraClient({
    host: opts.host,
    basic_auth: {
      base64: Buffer.from(`${opts.user}:${opts.api_key}`).toString('base64'),
    },
  });

  client.myself
    .getMyself()
    .catch(err =>
      fastify.log.error(`[Jira] Unable to connect to Jira server: \n${err}`)
    );

  fastify.decorate('jira', client);
  done();
});

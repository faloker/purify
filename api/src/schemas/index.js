export default fastify => {
  fastify.addSchema({
    $id: 'project',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      title: { type: 'string' },
      subtitle: { type: 'string' },
      slug: { type: 'string' },
      units: { type: 'number' },
      tickets: { type: 'number' },
      issues: { type: 'number' },
    },
  });

  fastify.addSchema({
    $id: 'report_without_content',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      created_at: { type: 'string' },
      statistics: {
        type: 'object',
        properties: {
          new: { type: 'number' },
          old: { type: 'number' },
        },
      },
      unit: { type: 'string' },
      template: { type: 'object', properties: { name: { type: 'string' } } },
    },
  });

  fastify.addSchema({
    $id: 'issue',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      fields: { type: 'object' },
      is_closed: { type: 'boolean' },
      is_fp: { type: 'boolean' },
      dup_score: { type: 'number' },
      risk: { type: 'string' },
      template: { type: 'string' },
      report: { type: 'string' },
      ticket_id: { type: 'string' },
      unit: { type: 'string' },
      comments: { type: 'array' },
    },
  });

  fastify.addSchema({
    $id: 'authUser',
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      token: { type: 'string' },
      image: { type: 'string' },
    },
  });

  fastify.addSchema({
    $id: 'unit',
    type: 'object',
    properties: {
      _id: { type: 'string' },
      name: { type: 'string' },
      slug: { type: 'string' },
      project: { type: 'string' },
      reports: { type: 'number' },
      closed_tickets_len: { type: 'number' },
      tickets_len: { type: 'number' },
    },
  });
};

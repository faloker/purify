const create = {
  description: 'Create a unit',
  tags: ['units'],
  body: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      slug: { type: 'string' },
      project: { type: 'string' },
    },
    required: ['name', 'project'],
  },
  response: {
    201: 'unit#',
  },
};

const getByProjectSlug = {
  description: 'Get units by project slug',
  tags: ['units'],
  querystring: {
    project: { type: 'string' },
  },
  response: {
    200: {
      description: 'Success',
      type: 'array',
      items: 'unit#',
    },
  },
};

const fetch = {
  description: 'Fetch all units',
  tags: ['units'],
  response: {
    200: {
      description: 'Success',
      type: 'array',
      items: 'unit#',
    },
  },
};

export default { create, getByProjectSlug, fetch };

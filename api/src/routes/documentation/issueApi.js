const fetchByUnit = {
  description: 'Get issues by unit slug',
  tags: ['issues'],
  querystring: {
    unit_slug: { type: 'string' },
  },
  response: {
    200: {
      description: 'Success',
      type: 'array',
      items: 'issue#',
    },
  },
};

export default { fetchByUnit };

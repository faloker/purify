const fetchByUnit = {
  description: 'Get issues by unit slug',
  tags: ['issues'],
  querystring: {
    unit: { type: 'string' },
  },
  response: {
    200: {
      description: 'Success',
      type: 'array',
      items: 'issue#',
    },
  },
};

const postComment = {
  description: 'Post comment',
  tags: ['issues'],
  params: {
    id: { type: 'string' },
  },
  body: {
    type: 'object',
    properties: {
      author: { type: 'string' },
      text: { type: 'string' },
      date: { type: 'string' },
    },
    required: ['author', 'text', 'date'],
  },
};

export default { fetchByUnit, postComment };

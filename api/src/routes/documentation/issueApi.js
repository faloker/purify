export const fetchByUnit = {
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

export const postComment = {
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
    },
    required: ['author', 'text'],
  },
};

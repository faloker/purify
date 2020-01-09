const save = {
  description: 'Save a template',
  tags: ['templates'],
  summary: 'Save a template',
  body: {
    type: 'object',
    properties: {
      path_to_issues: { type: 'string' },
      report: { type: 'string' },
      name: { type: 'string' },
      title_pattern: { type: 'string' },
      subtitle_pattern: { type: 'string' },
      tags: { type: 'array', items: { type: 'string' } },
      merge_fields: { type: 'array', items: { type: 'string' } },
      title_fields: { type: 'array', items: { type: 'string' } },
      body_fields: { type: 'array', items: { type: 'string' } },
      compare_fields: { type: 'array', items: { type: 'string' } },
    },
    required: [
      'path_to_issues',
      'report',
      'name',
      'title_pattern',
      'subtitle_pattern',
      'merge_fields',
      'title_fields',
      'body_fields',
      'compare_fields',
    ],
  },
  response: {
    201: {
      description: 'Success',
      type: 'object',
      properties: {
        _id: { type: 'string' },
      },
    },
  },
};

export default { save };

const save = {
  description: 'Save a report',
  tags: ['reports'],
  summary: 'Save report',
  body: {
    type: 'object',
    properties: {
      file: { type: 'object' },
      unit: { type: 'string' },
      template: { type: 'string' },
    },
    required: ['file', 'unit'],
  },
  response: {
    201: {
      description: 'Success',
      type: 'object',
      properties: {
        _id: { type: 'string' },
        statistics: { 
          type: 'object',
          properties: {
            new: { type: 'number' },
            old: { type: 'number' },
          },
        },
      },
    },
  },
};

const fetchByUnit = {
  description: 'Get reports by unit slug',
  tags: ['reports'],
  querystring: {
    unit_slug: { type: 'string' },
  },
  response: {
    200: {
      description: 'Success',
      type: 'array',
      items: 'report_without_content#',
    },
  },
};

const getContent = {
  description: 'Get content of a report',
  tags: ['reports'],
  params: {
    id: { type: 'string' },
  },
  response: {
    200: {
      description: 'Success',
      type: 'object',
    },
  },
};

export default { save, fetchByUnit, getContent };

export const create = {
  description: 'Create a project',
  tags: ['projects'],
  summary: 'Create a project',
  body: {
    type: 'object',
    properties: {
      title: { type: 'string' },
      subtitle: { type: 'string' },
    },
    required: ['title'],
  },
  response: {
    201: 'project#',
  },
};

// const get = {
//   description: 'Get a project',
//   summary: 'Get a single project by slug',
//   tags: ['projects'],
//   params: {
//     slug: { type: 'string' },
//   },
//   response: {
//     200: {
//       description: 'Success',
//       type: 'object',
//       properties: {
//         _id: { type: 'string' },
//         title: { type: 'string' },
//         subtitle: { type: 'string' },
//         slug: { type: 'string' },
//         units: {
//           type: 'array',
//           items: {
//             properties: {
//               _id: { type: 'string' },
//               name: { type: 'string' },
//               slug: { type: 'string' },
//             },
//           },
//         },
//       },
//     },
//   },
// };

export const fetch = {
  description: 'Fetch all projects',
  summary: 'Get all projects',
  tags: ['projects'],
  response: {
    200: {
      description: 'Success',
      type: 'array',
      items: 'project#',
    },
  },
};

export const stats = {
  description: 'Fetch statistics for the project and its units',
  summary: 'Fetch statistics for the project and its units',
  tags: ['projects'],
  querystring: {
    project: { type: 'string' },
  },
  // response: {
  //   200: {
  //     description: 'Success',
  //     type: 'array',
  //     items: 'project#',
  //   },
  // },
};

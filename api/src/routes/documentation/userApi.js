const create = {
  description: 'Create a user',
  tags: ['users'],
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      email: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'email', 'password'],
  },
  response: {
    201: 'authUser#',
  },
};

const auth = {
  description: 'Auth user',
  tags: ['users'],
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        email: { type: 'string' },
        username: { type: 'string' },
        image: { type: 'string' },
        _id: { type: 'string' },
      },
    },
  },
};

const login = {
  description: 'Login user',
  tags: ['users'],
  body: {
    type: 'object',
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
    required: ['username', 'password'],
  },
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        email: { type: 'string' },
        token: { type: 'string' },
        username: { type: 'string' },
        image: { type: 'string' },
      },
    },
  },
};

const createToken = {
  description: 'Create API token for user',
  tags: ['users'],
  response: {
    200: {
      description: 'Success',
      type: 'object',
      properties: {
        api_token: { type: 'string' },
      },
    },
  },
};

export default {
  create, auth, login, createToken,
};

export default {
  database: {
    settings: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
      poolSize: 10,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    },
  },
  logger: {
    prettyPrint: true,
  },
  jira: {
    enabled: false,
    values: {
      host: 'example.jira.com',
      user: 'user@example.com',
      api_key: 'token',
    },
  },
  smtp: {
    enabled: false,
    values: {
      host: 'smtp.example.com',
      port: 465,
      secure: true,
      auth: {
        user: 'user',
        password: 'password',
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
};

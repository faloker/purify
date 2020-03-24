const config = {
  mongodb: {
    url: process.env.MONGODB_URI,
    databaseName: process.env.DB_NAME,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  },

  migrationsDir: "migrations",

  changelogCollectionName: "changelog"
};

module.exports = config;

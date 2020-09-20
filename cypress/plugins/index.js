const mongoose = require('mongoose');
const cypressTypeScriptPreprocessor = require('./cy-ts-preprocessor');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  on('file:preprocessor', cypressTypeScriptPreprocessor);

  on('task', {
    'db:drop': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');

      const collections = [
        'projects',
        'units',
        'tokens',
        'reports',
        'templates',
        'tickets',
        'issues',
        'comments',
      ];

      collections.forEach(async (col) => {
        await conn.collection(col).deleteMany({});
      });

      return null;
    },

    'db:drop:projects': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');
      conn.collection('projects').deleteMany({});
      return null;
    },
    
    'db:drop:units': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');
      conn.collection('units').deleteMany({});
      return null;
    },
    
    'db:drop:reports': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');
      conn.collection('reports').deleteMany({});
      return null;
    },
    
    'db:drop:tokens': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');
      conn.collection('tokens').deleteMany({});
      return null;
    },
    
    'db:drop:templates': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');
      conn.collection('templates').deleteMany({});
      return null;
    },
  });

  return config;
};

const mongoose = require('mongoose');

module.exports = (on, config) => {
  require('@cypress/code-coverage/task')(on, config);

  on('task', {
    'flush:db': async () => {
      var conn = mongoose.createConnection('mongodb://localhost:27017/nest');

      const collections = [
        'users',
        'projects',
        'units',
        'reports',
        'templates',
        'tickets',
        'issues',
        'comments',
      ];

      collections.forEach((col) => {
        conn.collection(col).remove();
      });

      return null;
    },
  });

  return config;
};

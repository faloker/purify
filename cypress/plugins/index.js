const mongoose = require('mongoose');

module.exports = (on, config) => {
  on('task', require('@cypress/code-coverage/task'));

  // on('task', {
  //   'flush:db': async () => {
  //     const url = 'mongodb://localhost:27017/test';

  //     // const conn = mongoose.createConnection(url, {
  //     //   useNewUrlParser: true,
  //     //   useUnifiedTopology: true,
  //     //   useFindAndModify: false,
  //     //   useCreateIndex: true,
  //     // });
  //     // const url = 'mongodb://localhost:27017/purify';
  //     await mongoose.connect(url)

  //     await mongoose.connection.collection('users').remove();
  //     // await conn.collection('projects').remove();
  //     // await conn.collection('units').remove();
  //     // await conn.collection('reports').remove();
  //     // await conn.collection('templates').remove();
  //     // await conn.collection('tickets').remove();
  //     // await conn.collection('issues').remove();
  //     // await conn.collection('comments').remove();
  //     // await conn.collection('jirasettings').remove();
  //     // await conn.collection('slacksettings').remove();

  //     return null;
  //   },
  // });
};

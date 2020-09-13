const uuid = require('uuid');

module.exports = {
  async up(db, client) {
    await db.collection('users').insertOne({
      _id: uuid.v4(),
      username: 'purify',
      email: 'purify@purify.purify',
    });
  },

  async down(db, client) {
    await db.collection('users').deleteOne({ username: 'purify' });
  },
};

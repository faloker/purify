// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = {
  async up(db, client) {
    await db
      .collection('users')
      .updateMany({ type: { $exists: false } }, { $set: { type: 'local' } });
  },

  async down(db, client) {
    await db.collection('users').updateMany({ type: { $exists: true } }, { $unset: { type: '' } });
  },
};

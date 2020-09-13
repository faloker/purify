module.exports = {
  async up(db, client) {
    await db
      .collection('users')
      .updateMany({ type: { $exists: false } }, { $set: { type: 'local' } });
  },

  async down(db, client) {
    await db
      .collection('users')
      .updateMany({ type: { $exists: true } }, { $unset: { type: '' } });
  },
};

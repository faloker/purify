module.exports = {
  async up(db, client) {
    await db
      .collection('users')
      .updateMany({ roles: { $exists: false } }, { $set: { role: 'admin' } });
  },

  async down(db, client) {
    await db
      .collection('users')
      .updateMany({ roles: { $exists: true } }, { $unset: { role: '' } });
  },
};

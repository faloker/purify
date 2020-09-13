module.exports = {
  async up(db, client) {
    await db
      .collection('reports')
      .updateMany(
        { type: { $exists: false } },
        { $set: { type: 'file' } }
      );
  },

  async down(db, client) {
    await db
      .collection('reports')
      .updateMany(
        { type: { $exists: true } },
        { $unset: { type: '' } }
      );
  },
};

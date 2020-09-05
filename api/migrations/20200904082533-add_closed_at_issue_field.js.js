module.exports = {
  async up(db, client) {
    await db
      .collection('issues')
      .updateMany({ closedAt: { $exists: false }, status: 'closed' }, [
        { $set: { closedAt: '$updatedAt' } },
      ]);
  },

  async down(db, client) {
    await db
      .collection('issues')
      .updateMany(
        { closedAt: { $exists: true } },
        { $unset: { closedAt: '' } }
      );
  },
};

module.exports = {
  async up(db, client) {
    await db.listCollections().forEach(async col => {
      await db
        .collection(col.name)
        .updateMany(
          { createdAt: { $exists: false } },
          { $rename: { created_at: 'createdAt', updated_at: 'updatedAt' } }
        );
    });
  },

  async down(db, client) {
    await db.listCollections().forEach(async col => {
      await db
        .collection(col.name)
        .updateMany(
          { createdAt: { $exists: true } },
          { $rename: { createdAt: 'created_at', updatedAt: 'updated_at' } }
        );
    });
  },
};

module.exports = {
  async up(db, client) {
    await db
      .collection('issues')
      .find()
      .forEach(async issue => {
        const unit = await db.collection('units').findOne({ _id: issue.unit });
        await db
          .collection('issues')
          .updateOne(
            { _id: issue._id },
            { $set: { project: unit.project } }
          );
      });
  },

  async down(db, client) {
    await db
      .collection('issues')
      .updateMany({ project: { $exists: true } }, { $unset: { project: '' } });
  },
};

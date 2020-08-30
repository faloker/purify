module.exports = {
  async up(db, client) {
    await db
      .collection('reports')
      .find()
      .forEach(async report => {
        const unit = await db.collection('units').findOne({ _id: report.unit });
        await db
          .collection('reports')
          .updateOne(
            { _id: report._id },
            { $set: { project: unit.project } }
          );
      });
  },

  async down(db, client) {
    await db
      .collection('reports')
      .updateMany({ project: { $exists: true } }, { $unset: { project: '' } });
  },
};

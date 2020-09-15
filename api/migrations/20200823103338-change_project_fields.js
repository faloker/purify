module.exports = {
  async up(db, client) {
    await db.collection('projects').dropIndex('slug_1').catch(() => {});
    await db
      .collection('projects')
      .find()
      .forEach(async project => {
        await db.collection('projects').updateOne(
          { _id: project._id },
          {
            $set: {
              name: project.slug,
              description: project.subtitle,
              displayName: project.title,
            },
            $unset: { title: '', subtitle: '', slug: '' },
          }
        );
      });
    await db.collection('projects').createIndex({ name: 1 }, { unique: true });
  },

  async down(db, client) {
    await db.collection('projects').dropIndex('name_1');
    await db
      .collection('projects')
      .find()
      .forEach(async project => {
        await db.collection('projects').updateOne(
          { _id: project._id },
          {
            $set: {
              slug: project.name,
              subtitle: project.description,
              title: project.displayName,
            },
            $unset: { name: '', description: '', displayName: '' },
          }
        );
      });
    await db.collection('projects').createIndex({ slug: 1 }, { unique: true });
  },
};

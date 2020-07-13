// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');
const slug = require('slug');

module.exports = {
  async up(db, client) {
    await db.collection('templates')
      .find()
      .forEach(async (template) => {
        await db.collection('templates').updateOne(
          { _id: template._id },
          { $set: { slug: slug(template.name) } }
        );
      });
  },

  async down(db, client) {
    await db
      .collection('templates')
      .updateMany({ slug: { $exists: true } }, { $unset: { slug: '' } });
  },
};

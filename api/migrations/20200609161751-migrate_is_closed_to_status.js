// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = {
  async up(db, client) {
    // set a new field called status based on the value of is_closed
    await db
      .collection('issues')
      .updateMany({ is_closed: true }, { $set: { status: 'closed' } });

    await db
      .collection('issues')
      .updateMany({ is_closed: false }, { $set: { status: 'open' } });

    await db
      .collection('issues')
      .updateMany(
        { is_closed: { $exists: true } },
        { $unset: { is_closed: '' } }
      );
  },

  async down(db, client) {
    await db
      .collection('issues')
      .updateMany({ status: 'closed' }, { $set: { is_closed: true } });

    await db
      .collection('issues')
      .updateMany({ status: 'open' }, { $set: { is_closed: false } });

    await db
      .collection('issues')
      .updateMany({ status: { $exists: true } }, { $unset: { status: '' } });
  },
};

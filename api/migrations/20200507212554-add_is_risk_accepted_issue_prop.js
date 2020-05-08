// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = {
  async up(db, client) {
    await db
      .collection('issues')
      .updateMany(
        { is_risk_accepted: { $exists: false } },
        { $set: { is_risk_accepted: false } }
      );
  },

  async down(db, client) {
    await db
      .collection('issues')
      .updateMany(
        { is_risk_accepted: { $exists: true } },
        { $unset: { is_risk_accepted: '' } }
      );
  },
};

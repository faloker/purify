module.exports = {
  async up(db, client) {
    // combine different resolutions in one field
    await db
      .collection('issues')
      .updateMany({ is_fp: true }, { $set: { resolution: 'false positive' } });

    await db
      .collection('issues')
      .updateMany(
        { is_risk_accepted: true },
        { $set: { resolution: 'accepted risk' } }
      );

    await db
      .collection('issues')
      .updateMany(
        { is_fp: false, is_risk_accepted: false, status: 'closed' },
        { $set: { resolution: 'resolved' } }
      );

    await db
      .collection('issues')
      .updateMany({}, { $unset: { is_fp: '', is_risk_accepted: '' } });
  },

  async down(db, client) {
    await db
      .collection('issues')
      .updateMany({ resolution: 'false positive' }, { $set: { is_fp: true } });

    await db
      .collection('issues')
      .updateMany(
        { resolution: 'accepted risk' },
        { $set: { is_risk_accepted: true } }
      );

    await db
      .collection('issues')
      .updateMany(
        { resolution: 'resolved' },
        { $set: { is_fp: false, is_risk_accepted: false } }
      );

    await db
      .collection('issues')
      .updateMany({}, { $unset: { resolution: '' } });
  },
};

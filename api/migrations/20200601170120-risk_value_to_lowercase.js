// eslint-disable-next-line @typescript-eslint/no-var-requires
const uuid = require('uuid');

module.exports = {
  async up(db, client) {
    await db
      .collection('issues')
      .updateMany({}, [{ $set: { risk: { $toLower: '$risk' } } }]);
  },
};

module.exports = {
  async up(db, client) {
    await db
      .collection('issues')
      .updateMany({}, [{ $set: { risk: { $toLower: '$risk' } } }]);
  },

  async down(db, client) {
  //  
  },
};

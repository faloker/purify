module.exports = {
  async up(db, client) {
    await db.collection('users').dropIndex('username_1');
    await db
      .collection('users')
      .find()
      .forEach(async user => {
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              name: user.username,
            },
            $unset: { username: '' },
            $rename: { refresh_token: 'refreshToken' },
          }
        );
      });
  },

  async down(db, client) {
    await db
      .collection('users')
      .find()
      .forEach(async user => {
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              username: user.name,
            },
            $unset: { name: '' },
            $rename: { refreshToken: 'refresh_token' },
          }
        );
      });
    await db.collection('users').createIndex({ username: 1 }, { unique: true });
  },
};

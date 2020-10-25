const uuid = require('uuid');

module.exports = {
  async up(db, client) {
    await db
      .collection('users')
      .find({ name: { $ne: 'System' } })
      .forEach(async (user) => {
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              image: `https://avatars.dicebear.com/api/avataaars/${user._id}.svg`,
            },
          }
        );
      });

    await db.collection('users').updateOne(
      { name: { $eq: 'System' } },
      {
        $set: {
          image: `https://avatars.dicebear.com/api/bottts/system.svg`,
        },
      }
    );
  },

  async down(db, client) {
    await db
      .collection('users')
      .find({ name: { $ne: 'System' } })
      .forEach(async (user) => {
        await db.collection('users').updateOne(
          { _id: user._id },
          {
            $set: {
              image: `https://api.adorable.io/avatars/285/${uuid.v4()}.png`,
            },
          }
        );
      });

    await db.collection('users').updateOne(
      { name: { $eq: 'System' } },
      {
        $set: {
          image: `https://api.adorable.io/avatars/285/system.png`,
        },
      }
    );
  },
};

const crypto = require('crypto');

module.exports = {
  async up(db, client) {
    const salt = crypto.randomBytes(16).toString('hex');
    const password = crypto
      .pbkdf2Sync('secret', salt, 9999, 512, 'sha512')
      .toString('hex');
    await db.collection('users').updateOne(
      {
        name: 'purify',
      },
      {
        $set: {
          name: 'System',
          email: 'system@purify.com',
          password: password,
          image: 'https://api.adorable.io/avatars/285/system.png',
          salt: salt,
          ssoBypass: true,
          memberships: [],
          role: 'owner',
        },
      }
    );
  },

  async down(db, client) {
    await db.collection('users').updateOne(
      { name: 'System' },
      {
        $set: {
          name: 'purify',
          email: 'purify@purify.purify',
        },
        $unset: {
          password: '',
          salt: '',
          ssoBypass: '',
          role: '',
          memberships: '',
        },
      }
    );
  },
};

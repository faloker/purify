import nconf from 'nconf';
import path from 'path';

const env = process.env.NODE_ENV || 'dev';

const config = new nconf.Provider({
  stores: [
    {
      name: 'default',
      type: 'literal',
      store: require(path.join(__dirname, 'default')).default,
    },
    {
      name: 'env',
      type: 'literal',
      store: require(path.join(__dirname, `${env}`)).default,
    },
  ],
});

export default config;

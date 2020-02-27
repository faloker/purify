import nconf from 'nconf';
import path from 'path';

const env = process.env.NODE_ENV || 'local';

const config = new nconf.Provider({
  stores: [
    {
      name: 'default',
      type: 'file',
      file: path.join(__dirname, 'default.json'),
    },
    {
      name: 'env',
      type: 'file',
      file: path.join(__dirname, `${env}.json`),
    },
  ],
});

export default config;

module.exports = {
    "extends": "airbnb-base",
    "plugins": [
      "mocha"
    ],
    "env": {
      "node": true,
      "mocha": true
    },
    "rules": {
      'no-await-in-loop': 'off',
      'func-names': 'off',
      'no-restricted-syntax': 'off',
      'no-underscore-dangle': 'off',
      "mocha/no-exclusive-tests": "error",
      "import/no-extraneous-dependencies": ["error", {"devDependencies": true}]
    }
};
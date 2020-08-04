module.exports = {
  root: true,
  env: {
    node: true,
  },
  plugins: ['vuetify'],
  extends: [
    'plugin:vue/recommended',
    'plugin:prettier-vue/recommended',
    '@vue/typescript/recommended',
    '@vue/prettier/@typescript-eslint',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  settings: {
    'prettier-vue': {
      SFCBlocks: {
        template: false,
        script: true,
        style: true,
      },

      usePrettierrc: true,

      fileInfoOptions: {
        ignorePath: '.testignore',
        withNodeModules: false,
      },
    },
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-empty-function': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 2,
        multiline: {
          max: 1,
          allowFirstLine: false,
        },
      },
    ],
  },
};

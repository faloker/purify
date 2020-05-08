module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', 'plugin:prettier-vue/recommended'],
  plugins: ['vuetify'],
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
  parserOptions: {
    parser: 'babel-eslint',
  }
};

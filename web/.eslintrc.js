module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/recommended', '@vue/airbnb'],
  plugins: ['vuetify'],
  rules: {
    'import/no-webpack-loader-syntax': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'vue/html-self-closing': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/max-attributes-per-line': ['error', {
      singleline: 2,
      multiline: {
        max: 1,
        allowFirstLine: false,
      },
    }],
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'vuetify/no-deprecated-classes': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};

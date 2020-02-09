module.exports = {
  extends: ["airbnb-base", "plugin:prettier/recommended"],
  env: {
    node: true,
    es6: true
  },
  rules: {
    "prettier/prettier": ["error", { singleQuote: true }],
    "no-await-in-loop": "off",
    "func-names": "off",
    "no-restricted-syntax": "off",
    "no-underscore-dangle": "off",
  }
};
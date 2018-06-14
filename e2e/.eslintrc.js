module.exports = {
  extends: '../.eslintrc',
  rules: {
    'no-unused-expressions': 0,
    'object-shorthand': 0,
  },
  globals: {
    cy: true,
    Cypress: true,
  },
};

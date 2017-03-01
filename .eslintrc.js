module.exports = {
  extends: 'ndla',
  env: {
    jest: true
  },
  rules: {
    'react/prop-types': [ 2, {'ignore': ['children', 'className', 't'] }],
    'react/forbid-prop-types': 1,
    'react/require-default-props': 0,
  },
  'globals': {
    '__CLIENT__': true,
    '__SERVER__': true,
    '__DISABLE_SSR__': true
  }
};

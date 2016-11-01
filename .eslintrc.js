module.exports = {
  extends: 'ndla',
  rules: {
    'react/prop-types': [ 2, {'ignore': ['children', 'className', 't'] }],
  },
  'globals': {
    '__CLIENT__': true,
    '__SERVER__': true,
    '__DISABLE_SSR__': true
  }
};

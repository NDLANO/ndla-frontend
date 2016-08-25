module.exports = {
  extends: 'airbnb',
  env: {
    browser: true
  },
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    }
  },
  rules: {
    'max-len': [2, 200, 2, {
      ignoreUrls: true,
      ignoreComments: false
    }],

    'jsx-a11y/href-no-hash': 1,

    'import/prefer-default-export': 0,
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies':
      ['error', {'devDependencies': true}],

    'react/prop-types': [ 2, {'ignore': ['children','className'] }],

    'react/prefer-stateless-function': 1
  },
  'globals': {
    '__CLIENT__': true,
    '__SERVER__': true,
    '__DISABLE_SSR__': true
  }
};

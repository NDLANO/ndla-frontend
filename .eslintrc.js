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

    'react/jsx-filename-extension': [0, { extensions: [".js", ".jsx"] }],
    'import/prefer-default-export': 0,
    "react/forbid-prop-types": 0,
    'no-constant-condition': [2, { 'checkLoops': false }],
    'react/no-unused-prop-types': 0,
    'react/no-danger': 0,
    'import/no-named-as-default': 0,
    'import/no-extraneous-dependencies':
      ['error', {'devDependencies': true}],

    'react/prop-types': [ 2, {'ignore': ['children', 'className', 't'] }],
  },
  'globals': {
    '__CLIENT__': true,
    '__SERVER__': true,
    '__DISABLE_SSR__': true
  }
};

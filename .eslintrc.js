module.exports = {
  extends: 'ndla',
  env: {
    jest: true,
  },
  rules: {
    'react/prop-types': [2, { ignore: ['children', 'className', 't'] }],
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
  },
  globals: {
    __CLIENT__: true,
    __SERVER__: true,
  },
};

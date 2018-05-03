module.exports = {
  extends: 'ndla',
  env: {
    jest: true,
  },
  rules: {
    'graphql/template-strings': [
      'error',
      {
        env: 'apollo',
        schemaJson: require('./src/gqlSchema.json'),
      },
    ],
    'react/prop-types': [2, { ignore: ['children', 'className', 't'] }],
    'react/no-did-mount-set-state': 0,
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
  },
  plugins: ['graphql'],
};

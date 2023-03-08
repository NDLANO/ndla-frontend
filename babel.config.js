module.exports = {
  presets: [
    [
      'razzle',
      {
        'preset-react': {
          runtime: 'automatic',
          importSource: '@emotion/react',
        },
      },
    ],
  ],

  plugins: [
    ['@emotion', { autoLabel: 'always' }],
    'graphql-tag',
    '@babel/plugin-proposal-optional-chaining',
    process.env.BABEL_ENV === 'development' &&
    process.env.BUILD_TARGET === 'client'
      ? 'react-refresh/babel'
      : false,
  ].filter(e => !!e),
};

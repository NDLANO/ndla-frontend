module.exports = {
  presets: [
    '@babel/preset-typescript',
    [
      '@babel/preset-react',
      { runtime: 'automatic', importSource: '@emotion/react' },
    ],
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'not dead'],
        },
      },
    ],
  ],

  plugins: [
    ['@emotion', { autoLabel: 'always', sourceMap: false }],
    'graphql-tag',
    process.env.BABEL_ENV === 'development' &&
    process.env.BUILD_TARGET === 'client'
      ? 'react-refresh/babel'
      : false,
  ].filter((e) => !!e),
};

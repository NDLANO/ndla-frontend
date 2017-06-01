/**
 * COMMON WEBPACK CONFIGURATION
 */

process.env.WEBPACK_VERSION = require('webpack/package.json').version;
const path = require('path');
const webpack = require('webpack');

const entry = {
  main: ['./src/index.jsx', './style/index.css'],
  embed: ['./server/embedScripts.js'],
  mathjaxConfig: ['./src/mathjaxConfig.js'],
};

module.exports = options => ({
  entry: Object.assign(entry, {
    main: options.entry.main.concat(entry.main),
    embed: options.entry.embed.concat(entry.embed),
  }),

  // prettier-ignore
  output: Object.assign(
    {
      // Compile into htdocs/assets
      path: path.resolve(process.cwd(), 'htdocs/assets'),
      publicPath: '/assets/',
    },
    options.output
  ), // Merge with env dependent settings

  module: {
    rules: options.rules.concat([
      {
        test: /\.jsx?|\.js?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/, // See .babelrc
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              'react',
              [
                'env',
                {
                  targets: options.babelPresetTargets,
                  useBuiltIns: true,
                  modules: false,
                },
              ],
            ],
            plugins: ['transform-object-rest-spread'],
          },
        },
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.woff$|\.ttf$/,
        use: options.fileLoader,
      },
      {
        test: /.json$/,
        use: 'json-loader',
      },
    ]),
  },

  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      },
      __CLIENT__: true,
      __SERVER__: false,
    }),
  ]),

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
    mainFields: ['jsnext:main', 'browser', 'main'],
  },

  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});

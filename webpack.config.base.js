/**
 * COMMON WEBPACK CONFIGURATION
 */

process.env.WEBPACK_VERSION = require('webpack/package.json').version;
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');

const entry = [
  'babel-polyfill',
  './src/index.jsx',
  './style/index.css',
];

module.exports = options => ({
  entry: options.entry.concat(entry),

  output: Object.assign({ // Compile into htdocs/assets
    path: path.resolve(process.cwd(), 'htdocs/assets'),
    publicPath: '/assets/',
  }, options.output), // Merge with env dependent settings

  module: {

    rules: [
      {
        test: /\.jsx?|\.js?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/, // See .babelrc
        loader: 'babel-loader',
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.woff$|\.ttf$/,
        loader: options.fileLoader,
      },
      {
        // Extract css to seprate file. Run css url's trough file loader for hashing in prod build
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallbackLoader: 'style-loader',
          loader: ['css-loader', 'postcss-loader'],
        }),
      },
      {
        test: /.json$/,
        loader: 'json-loader',
      },
    ],
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
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.css',
    ],
    mainFields: [
      'jsnext:main',
      'main',
    ],
  },

  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});

/**
 * DEVELOPMENT WEBPACK CONFIGURATION
 */

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


const plugins = [
  new ExtractTextPlugin('[name].css'),
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin(),
];

module.exports = require('./webpack.config.base')({
  // Add hot reloading in development
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000&reload=true&quiet=true',
  ],

  // Don't use hashes in dev mode for better performance
  output: {
    filename: '[name].js',
  },

  // Add development plugins
  plugins,

  // Load files without hash in development
  fileLoader: 'file-loader?name=[name].[ext]',

  // Emit a source map for easier debugging
  devtool: 'cheap-module-eval-source-map',
});

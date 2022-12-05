/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import merge from 'lodash/merge';
import path, { resolve } from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { loaders } from './loaders';
import { serverPlugins, sharedPlugins } from './plugins';
import serverBaseConfig from './server.base';

const serverDevConfig: Configuration = {
  // creates original code source maps, but does not allow for mid-line debugging.
  // we used to use cheap-module-source-map, but this is quicker, and the trade-off is worth it during dev.
  devtool: 'eval-cheap-module-source-map',
  mode: 'development',
  entry: {
    server: [resolve('./node_modules/webpack/hot/poll.js?300'), './src'],
  },
  module: {
    rules: loaders('development', 'server'),
  },
  resolve: {
    alias: {
      // Useful when linking to avoid mismatching react versions.
      react: path.resolve('./node_modules/react'),
    },
  },
  plugins: sharedPlugins.concat(serverPlugins),
  output: {
    path: path.resolve('./build'),
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    library: { type: 'commonjs2' },
  },
  externals: [
    // The server instance appears to struggle with loading assets.json when compiling for dev.
    // As such, load it during run-time.
    resolve('./build/assets.json'),
    // Externalize all node modules to make server dev bundle smaller.
    nodeExternals(),
  ],
  performance: {
    hints: false,
  },
  cache: {
    name: 'dev-server',
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};

export default merge(serverBaseConfig, serverDevConfig);

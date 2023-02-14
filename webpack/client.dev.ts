/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Configuration } from 'webpack';
import merge from 'lodash/merge';
import path from 'path';
import baseClientConfig from './client.base';
import { clientPlugins, sharedPlugins } from './plugins';
import { loaders } from './loaders';

const clientDevConfig: Configuration = {
  mode: 'development',
  // creates original code source maps, but does not allow for mid-line debugging.
  // we used to use cheap-module-source-map, but this is quicker, and the trade-off is worth it during dev.
  devtool: 'eval-cheap-module-source-map',
  //Make a script that injects CSS into development builds.
  entry: {
    injectCss: ['./src/style/index.css'],
  },
  module: {
    rules: loaders('development', 'client'),
  },
  resolve: {
    alias: {
      // Useful when linking to avoid mismatching react versions.
      react: path.resolve('./node_modules/react'),
    },
  },
  devServer: {
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: {
      disableDotRule: true,
    },
    hot: true,
    port: 3001,
    allowedHosts: 'all',
    client: {
      logging: 'none',
      overlay: false,
    },
    devMiddleware: {
      publicPath: 'http://localhost:3001/',
    },
    static: {
      watch: { ignored: /node_modules/ },
    },
  },
  output: {
    path: path.resolve('./build/public'),
    publicPath: 'http://localhost:3001/',
    filename: 'static/js/build/[name].js',
    chunkFilename: 'static/js/[name].chunk.js',
  },
  plugins: sharedPlugins.concat(clientPlugins),
  cache: {
    name: 'dev-client',
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
};

export default merge(baseClientConfig, clientDevConfig);

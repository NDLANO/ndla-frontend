/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import merge from 'lodash/merge';
import path from 'path';
import { Configuration } from 'webpack';
import { loaders } from './loaders';
import { serverPlugins, sharedPlugins } from './plugins';
import serverBaseConfig from './server.base';

const serverProdConfig: Configuration = {
  mode: 'production',
  target: 'node',
  devtool: 'source-map',
  module: {
    rules: loaders('production', 'server'),
  },
  // Bundle all dependencies into a single file to avoid having to install node_modules.
  // Reduces image size.
  externals: [],
  plugins: sharedPlugins.concat(serverPlugins),
  output: {
    path: path.resolve('./build'),
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    library: { type: 'commonjs2' },
  },
  optimization: {
    // Set this to false when debugging prod builds to speed up compilation significantly.
    minimize: true,
  },
  // Webpack spews out a couple of warnings regarding our usage of "externals: []", causing
  // the server build to fail in the CI. This hides those errors.
  ignoreWarnings: [
    {
      message: /the request of a dependency is an expression/,
    },
    {
      message: /Module not found: Error: Can't resolve 'encoding' in/,
    },
  ],
};

export default merge(serverBaseConfig, serverProdConfig);

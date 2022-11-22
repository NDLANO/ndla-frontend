/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import merge from 'lodash/merge';
import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import baseClientConfig from './client.base';
import { loaders } from './loaders';
import { clientPlugins, sharedPlugins } from './plugins';

const clientProdConfig: Configuration = {
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: loaders('production', 'client'),
  },
  plugins: sharedPlugins.concat(clientPlugins),
  // Inline all dependencies into the compiled file.
  externals: [],
  output: {
    path: path.resolve('./build/public'),
    publicPath: '/',
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
  },
  optimization: {
    moduleIds: 'deterministic',
    // Set this to false when debugging prod builds to speed up compilation significantly.
    minimize: true,
    // By default, webpack only uses Terser, but we also want to minimize CSS.
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
  },
};

export default merge(baseClientConfig, clientProdConfig);

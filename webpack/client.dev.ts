/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Configuration } from 'webpack';
import { merge } from 'lodash';
import path from 'path';
import baseClientConfig from './client.base';
import { clientPlugins, sharedPlugins } from './plugins';
import { loaders } from './loaders';

const clientDevConfig: Configuration = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  entry: {
    injectCss: ['./src/style/index.css'],
  },
  module: {
    rules: loaders('development', 'client'),
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  output: {
    path: path.resolve('./build/public'),
    publicPath: '/',
    libraryTarget: 'var',
    filename: 'static/js/build/[name].js',
    devtoolModuleFilenameTemplate: (info: { resourcePath: string }) =>
      path.resolve(info.resourcePath).replace(/\\/g, '/'),
    chunkFilename: 'static/js/[name].chunk.js',
    library: {
      type: 'var',
      name: 'client',
    },
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

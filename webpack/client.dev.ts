/// <reference path="../node_modules/webpack-dev-server/types/lib/Server.d.ts"/>
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
    publicPath: 'http://localhost:3001',
    libraryTarget: 'var',
    filename: 'static/js/build/[name].js',
    devtoolModuleFilenameTemplate: (info: { resourcePath: string }) =>
      path.resolve(info.resourcePath).replace(/\\/g, '/'),
    chunkFilename: 'static/js/[name].chunk.js',
    assetModuleFilename: 'static/media/[name][ext]',
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

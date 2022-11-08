import { merge } from 'lodash';
import path from 'path';
import webpack from 'webpack';
import { loaders } from './loaders';
import { serverPlugins, sharedPlugins } from './plugins';
import serverBaseConfig from './server.base';

const serverDevConfig: webpack.Configuration = {
  devtool: 'cheap-module-source-map',
  mode: 'development',
  //   watch: true,
  module: {
    rules: loaders('development', 'server'),
  },
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
    },
  },
  plugins: sharedPlugins.concat(serverPlugins),
  output: {
    path: path.resolve('./build'),
    publicPath: 'http://localhost:3001/',
    chunkFilename: '[name].chunk.js',
    libraryTarget: 'commonjs2',
    library: { type: 'commonjs2' },
  },
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

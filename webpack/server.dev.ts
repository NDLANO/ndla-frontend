import { merge } from 'lodash';
import path, { resolve } from 'path';
import { Configuration } from 'webpack';
import nodeExternals from 'webpack-node-externals';
import { loaders } from './loaders';
import { serverPlugins, sharedPlugins } from './plugins';
import serverBaseConfig from './server.base';

const serverDevConfig: Configuration = {
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
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    libraryTarget: 'commonjs2',
    library: { type: 'commonjs2' },
  },
  externals: [
    resolve('./build/assets.json'),
    nodeExternals({
      allowlist: [/\.(?!(?:jsx?|json)$).{1,5}$/i],
    }),
  ],
  externalsPresets: { node: true },
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

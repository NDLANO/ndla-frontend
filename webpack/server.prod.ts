import { merge } from 'lodash';
import path from 'path';
import { Configuration } from 'webpack';
import TerserPlugin from 'terser-webpack-plugin';
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
  externals: [],
  plugins: sharedPlugins.concat(serverPlugins),
  output: {
    path: path.resolve('./build'),
    publicPath: '/',
    chunkFilename: '[name].chunk.js',
    libraryTarget: 'commonjs2',
    library: { type: 'commonjs2' },
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
    emitOnErrors: false,
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

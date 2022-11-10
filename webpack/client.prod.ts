import { merge } from 'lodash';
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
  externals: [],
  output: {
    path: path.resolve('./build/public'),
    publicPath: '/',
    filename: 'static/js/[name].[contenthash:8].js',
    chunkFilename: 'static/js/[name].[contenthash:8].chunk.js',
    libraryTarget: 'var',
    library: { type: 'var', name: 'client' },
  },
  optimization: {
    moduleIds: 'deterministic',
    minimize: true,
    minimizer: [new TerserPlugin(), new CssMinimizerPlugin()],
    emitOnErrors: false,
    concatenateModules: true,
  },
};

export default merge(baseClientConfig, clientProdConfig);

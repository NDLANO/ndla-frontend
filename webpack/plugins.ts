/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import path from 'path';
import webpack, {
  DefinePlugin,
  HotModuleReplacementPlugin,
  ProvidePlugin,
  WatchIgnorePlugin,
  WebpackPluginInstance,
} from 'webpack';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
//@ts-ignore
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import CopyPlugin from 'copy-webpack-plugin';

export const clientPlugins: WebpackPluginInstance[] = [
  new ProvidePlugin({
    Buffer: [require.resolve('buffer'), 'Buffer'],
    process: [require.resolve('process')],
  }),
  new WebpackManifestPlugin({
    fileName: path.resolve('./build/assets.json'),
    writeToFileEmit: true,
  }),
  new DefinePlugin({
    'process.env.PORT': JSON.stringify('3000'),
    'process.env.VERBOSE': JSON.stringify('false'),
    'process.env.HOST': JSON.stringify('localhost'),
    'process.env.RAZZLE_ASSETS_MANIFEST': JSON.stringify(
      path.resolve('./build/assets.json'),
    ),
    'process.env.BUILD_TARGET': JSON.stringify('client'),
    'process.env.PUBLIC_PATH': JSON.stringify('/'),
    'process.env.RAZZLE_PUBLIC_DIR': JSON.stringify(
      process.env.NODE_ENV === 'development'
        ? path.resolve('./build/public')
        : 'build/public',
    ),
  }),
  ...(process.env.NODE_ENV === 'production'
    ? [
        new MiniCssExtractPlugin({
          filename: 'static/css/[name].[contenthash:8].css',
          chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CopyPlugin({
          patterns: [
            {
              from: 'public',
              to: '.',
            },
          ],
        }),
      ]
    : [new ReactRefreshWebpackPlugin()]),
];

export const serverPlugins: WebpackPluginInstance[] = [
  new DefinePlugin({
    'process.env.PORT': JSON.stringify('3000'),
    'process.env.VERBOSE': JSON.stringify(false),
    'process.env.HOST': JSON.stringify('localhost'),
    'process.env.RAZZLE_ASSETS_MANIFEST': JSON.stringify(
      path.resolve('./build/assets.json'),
    ),
    'process.env.BUILD_TARGET': JSON.stringify('server'),
    'process.env.PUBLIC_PATH': JSON.stringify('/'),
    'process.env.RAZZLE_PUBLIC_DIR': JSON.stringify(
      process.env.NODE_ENV === 'development'
        ? path.resolve('./public')
        : 'build/public',
    ),
  }),
  ...(process.env.NODE_ENV === 'development'
    ? [new HotModuleReplacementPlugin()]
    : [new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 1 })]),
];

export const sharedPlugins: WebpackPluginInstance[] = [
  new WatchIgnorePlugin({ paths: [path.resolve('./build/assets.json')] }),
];

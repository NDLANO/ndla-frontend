/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import { RuleSetRule, RuleSetUseItem } from 'webpack';

export const loaders = (
  env: 'development' | 'production',
  type: 'client' | 'server',
): RuleSetRule[] => {
  const babelLoader: RuleSetRule = {
    test: /\.(js|jsx|mjs|ts|tsx)$/,
    include: [path.resolve('./src')],
    use: {
      loader: 'babel-loader',
      options: {
        sourceMaps: true,
        cacheDirectory: true,
      },
    },
  };

  const fileRule: RuleSetRule = {
    exclude: [
      /\.html$/,
      /\.(js|jsx|mjs)$/,
      /\.(ts|tsx)$/,
      /\.(vue)$/,
      /\.(less)$/,
      /\.(re)$/,
      /\.(s?css|sass)$/,
      /\.json$/,
      /\.bmp$/,
      /\.gif$/,
      /\.jpe?g$/,
      /\.png$/,
      /\.cjs$/,
    ],
    type: 'asset/resource',
    generator: {
      filename: 'static/media/[name].[hash][ext]',
      emit: type === 'client',
    },
  };

  const urlRule: RuleSetRule = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    type: 'asset/inline',
    generator: {
      emit: type === 'client',
    },
  };

  const agnosticCssLoaders: RuleSetUseItem[] = [
    {
      loader: 'css-loader',
      options: {
        url: {
          filter: (url: string) => {
            return !url.includes('data:image/svg');
          },
        },
        importLoaders: 1,
        modules: {
          auto: true,
          localIdentName:
            env !== 'production'
              ? '[path][name]__[local]'
              : '[name]__[local]__[hash:base64:5]',
          exportOnlyLocals: type === 'server',
        },
      },
    },
    { loader: 'postcss-loader' },
    { loader: 'sass-loader' },
  ];

  const clientCssLoaders: RuleSetUseItem[] = [
    env === 'development'
      ? { loader: 'style-loader' }
      : { loader: MiniCssExtractPlugin.loader },
  ];

  return [
    babelLoader,
    fileRule,
    urlRule,
    {
      test: /\.css$/,
      use:
        type === 'client'
          ? clientCssLoaders.concat(agnosticCssLoaders)
          : agnosticCssLoaders,
    },
  ];
};

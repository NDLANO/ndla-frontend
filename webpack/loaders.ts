import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import path from 'path';
import webpack from 'webpack';

export const loaders = (
  env: 'development' | 'production',
  type: 'client' | 'server',
): webpack.RuleSetRule[] => {
  const babelLoader: webpack.RuleSetRule = {
    test: /\.(js|jsx|mjs|ts|tsx)$/,
    include: [path.resolve('./src'), path.resolve('./node_modules')],
    use: {
      loader: 'babel-loader',
      options: {
        sourceMaps: true,
        cacheDirectory: true,
      },
    },
  };

  const fileRule: webpack.RuleSetRule = {
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
      emit: type === 'client',
    },
  };

  const urlRule: webpack.RuleSetRule = {
    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
    type: 'asset/inline',
    generator: {
      emit: type === 'client',
    },
  };

  const agnosticCssLoaders: webpack.RuleSetUseItem[] = [
    {
      loader: 'css-loader',
      options: {
        importLoaders: 1,
        modules: {
          auto: true,
          localIdentName: '[name]__[local]__[hash:base64:5]',
          exportOnlyLocals: type === 'server',
        },
      },
    },
    { loader: 'postcss-loader' },
    { loader: 'sass-loader' },
  ];

  const clientCssLoaders: webpack.RuleSetUseItem[] = [
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

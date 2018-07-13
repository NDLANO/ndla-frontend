const { modifyRule } = require('razzle-config-utils');
const webpack = require('webpack'); // eslint-disable-line import/no-extraneous-dependencies
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  modify(config, { target, dev }) {
    const appConfig = config;

    modifyRule(appConfig, { test: /\.css$/ }, rule => {
      rule.use.push({ loader: 'postcss-loader' });
    });

    appConfig.module.rules.shift(); // remove eslint-loader
    if (target === 'web') {
      appConfig.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[hash:8].js';

      if (dev) {
        appConfig.entry.embed = [
          appConfig.entry.client[0],
          appConfig.entry.client[1],
          './src/iframe',
        ];
        appConfig.entry.injectCss = ['./src/style/index.css'];
      } else {
        appConfig.entry.embed = ['./src/iframe'];
      }

      appConfig.entry.mathJaxConfig = dev
        ? [appConfig.entry.client[1], './src/mathjax/config.js']
        : ['./src/mathjax/config.js'];

      if (!dev) {
        appConfig.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-analyzer-report.html',
          }),
          new webpack.optimize.ModuleConcatenationPlugin(),
        );
      }
      appConfig.performance = {
        hints: false,
      };
    }
    if (!dev) {
      appConfig.devtool = 'source-map';
    }

    return appConfig;
  },
};

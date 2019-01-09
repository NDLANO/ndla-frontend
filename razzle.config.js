const { modifyRule } = require('razzle-config-utils');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const addEntry = require('./razzle-add-entry-plugin');

module.exports = {
  plugins: [
    addEntry({ entry: '@ndla/polyfill', name: 'polyfill' }),
    addEntry({ entry: './src/iframe', name: 'embed' }),
    addEntry({ entry: './src/lti', name: 'embed' }),
    addEntry({ entry: './src/mathjax/config', name: 'mathJaxConfig' }),
  ],
  modify(config, { target, dev }) {
    const appConfig = config;

    modifyRule(appConfig, { test: /\.css$/ }, rule => {
      rule.use.push({ loader: 'postcss-loader' });
      rule.use.push({ loader: 'sass-loader' });
    });

    appConfig.module.rules.shift(); // remove eslint-loader
    if (target === 'web') {
      appConfig.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[hash:8].js';

      if (dev) {
        appConfig.entry.injectCss = ['./src/style/index.css'];
      }

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

    if (target === 'node' && !dev) {
      appConfig.node.Buffer = false;
      // This change bundles node_modules into server.js. The result is smaller Docker images.
      // It triggers a couple of «Critical dependency: the request of a dependency is an
      // expression warning» which we can safely ignore.
      appConfig.externals = [];
      // Razzle/CRA breaks the build on webpack warnings. Disable CI env to circumvent the check.
      process.env.CI = false;
    }

    if (!dev) {
      appConfig.devtool = 'source-map';
    } else {
      appConfig.devtool = 'cheap-module-source-map';
    }

    return appConfig;
  },
};

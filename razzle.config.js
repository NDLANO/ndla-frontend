const { modifyRule } = require('razzle-config-utils');
const webpack = require('webpack');
const path = require('path');
const addEntry = require('./razzle-add-entry-plugin');

module.exports = {
  plugins: [
    addEntry({ entry: '@ndla/polyfill', name: 'polyfill' }),
    addEntry({ entry: './src/iframe', name: 'embed' }),
    addEntry({ entry: './src/lti', name: 'lti' }),
    addEntry({ entry: './public/static/mathjax-config', name: 'mathJaxConfig' }),
    {
      name: 'typescript',
      options: {
        useBabel: true,
        tsLoader: {
          transpileOnly: false,
          experimentalWatchApi: true,
        },
        forkTsChecker: {
          tsconfig: './tsconfig.json',
          tslint: undefined,
          watch: './src',
          typeCheck: false,
        },
      },
    },
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
          new webpack.optimize.ModuleConcatenationPlugin(),
        );
      }
      appConfig.performance = {
        hints: false,
      };
    }

    if (target === 'node' && !dev) {
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
      // Resolve react to the version in node_modules. This fixes issues
      // that arise if two instances of react is loaded. A common occurrence
      // when using yarn link
      appConfig.resolve.alias.react = path.resolve('./node_modules/react');
    }

    return appConfig;
  },
};

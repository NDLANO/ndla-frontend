const { modifyRule } = require('razzle-config-utils');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  plugins: [],
  modifyWebpackConfig({ env: { target, dev }, webpackConfig: appConfig }) {
    const addEntry = options => {
      if (target === 'web') {
        if (dev) {
          appConfig.entry[options.name] = [
            appConfig.entry.client[0], // hot reloading
            options.entry,
          ];
        } else {
          appConfig.entry[options.name] = [options.entry];
        }
      }
    };

    modifyRule(appConfig, { test: /\.css$/ }, rule => {
      rule.use.push({ loader: 'postcss-loader' });
      rule.use.push({ loader: 'sass-loader' });
    });

    addEntry({ entry: '@ndla/polyfill', name: 'polyfill' });
    addEntry({ entry: './src/iframe', name: 'embed' });
    addEntry({ entry: './src/lti', name: 'lti' });
    addEntry({
      entry: './public/static/mathjax-config',
      name: 'mathJaxConfig',
    });

    if (target === 'web') {
      appConfig.output.filename = dev
        ? 'static/js/[name].js'
        : 'static/js/[name].[hash:8].js';

      if (dev) {
        appConfig.entry.injectCss = ['./src/style/index.css'];
      }

      if (!dev) {
        appConfig.optimization.concatenateModules = true;
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

      // This tells webpack to resolve esm modules before commonjs on the server-side.
      // @apollo/client stopped being bundled without this when moving from 3.4.x to 3.5.x
      appConfig.resolve.mainFields = ['module', 'main'];

      // Razzle/CRA breaks the build on webpack warnings. Disable CI env to circumvent the check.
      process.env.CI = 'false';
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

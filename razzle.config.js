const { modifyRule } = require('razzle-config-utils');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  options: {
    // This change bundles node_modules into server.js. The result is smaller Docker images.
    // It triggers a couple of «Critical dependency: the request of a dependency is an
    // expression warning» which we can safely ignore.
    buildType: 'iso-serverless',
  },
  plugins: [],
  modifyWebpackConfig({ env: { target, dev }, webpackConfig: appConfig }) {
    appConfig.stats = 'errors-warnings';
    appConfig.infrastructureLogging = {
      level: 'warn',
    };
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

    // .cjs ending is not a part of the file-loader exclude array.
    // As such, these files will not be processed correctly. This fixes that.
    modifyRule(appConfig, { loader: 'file-loader' }, rule => {
      rule.exclude = rule.exclude.concat(/\.cjs$/);
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

    if (dev) {
      appConfig.cache = {
        name: target,
        type: 'filesystem',
        buildDependencies: {
          config: [__filename],
        },
      };
    }

    return appConfig;
  },
};

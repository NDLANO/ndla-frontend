/**
 * COMMON WEBPACK CONFIGURATION
 */

process.env.WEBPACK_VERSION = require('webpack/package.json').version;
const path = require('path');
const webpack = require('webpack');

const entry = {
  main: ['./src/index.jsx', './style/index.css', './style/ndla-favicon.png'],
  embed: ['./server/embedScripts.js'],
  mathjaxConfig: ['./src/mathjax/config.js'],
};

module.exports = options => ({
  entry: Object.assign(entry, {
    main: options.entry.main.concat(entry.main),
    embed: options.entry.embed.concat(entry.embed),
  }),

  // prettier-ignore
  output: Object.assign(
    {
      // Compile into htdocs/assets
      path: path.resolve(process.cwd(), 'htdocs/assets'),
      publicPath: '/assets/',
    },
    options.output
  ), // Merge with env dependent settings

  module: {
    rules: options.rules.concat([
      {
        test: /\.jsx?|\.js?$/, // Transform all .js and .jsx files required somewhere with Babel
        exclude: /node_modules/, // See .babelrc
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            presets: [
              'react',
              [
                'env',
                {
                  targets: options.babelPresetTargets,
                  useBuiltIns: true,
                  modules: false,
                  exclude: [
                    'es6.symbol',
                    'es6.map',
                    'es6.set',
                    'es6.weak-map',
                    'es6.weak-set',
                    'es6.typed.array-buffer',
                    'es6.typed.int8-array',
                    'es6.typed.uint8-array',
                    'es6.typed.uint8-clamped-array',
                    'es6.typed.int16-array',
                    'es6.typed.uint16-array',
                    'es6.typed.int32-array',
                    'es6.typed.uint32-array',
                    'es6.typed.float32-array',
                    'es6.typed.float64-array',
                  ],
                },
              ],
            ],
            plugins: [
              'transform-object-rest-spread',
              'transform-class-properties',
            ],
          },
        },
      },
      {
        test: /\.jpe?g$|\.gif$|\.png$|\.ico|\.svg$|\.woff$|\.ttf$/,
        use: options.fileLoader,
      },
      {
        test: /.json$/,
        use: 'json-loader',
      },
    ]),
  },

  plugins: options.plugins.concat([
    // Always expose NODE_ENV to webpack, in order to use `process.env.NODE_ENV`
    // inside your code for any environment checks; UglifyJS will automatically
    // drop any unreachable code.
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        LOCAL_ARTICLE_CONVERTER: process.env.LOCAL_ARTICLE_CONVERTER,
      },
      __CLIENT__: true,
      __SERVER__: false,
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      chunks: ['main'],
      filename: options.vendorFilename,
      minChunks(module) {
        return module.context && module.context.indexOf('node_modules') !== -1;
      },
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest',
      minChunks: Infinity,
    }),
  ]),

  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    extensions: ['.js', '.json', '.jsx', '.css'],
    mainFields: ['jsnext:main', 'module', 'browser', 'main'],
  },

  devtool: options.devtool,
  target: 'web', // Make web variables accessible to webpack, e.g. window
});

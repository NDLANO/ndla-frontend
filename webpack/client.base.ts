/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Configuration } from 'webpack';

const baseClientConfig: Configuration = {
  name: 'client',
  target: 'web',
  stats: 'errors-warnings',
  infrastructureLogging: {
    level: 'warn',
  },
  entry: {
    client: ['./src/client.tsx'],
    polyfill: ['@ndla/polyfill'],
    embed: ['./src/iframe/index.tsx'],
    lti: ['./src/lti/index.tsx'],
    mathJaxConfig: ['./public/static/mathjax-config.js'],
  },
  resolve: {
    fallback: {
      path: false,
      fs: false,
      util: false,
      assert: false,
      os: false,
      stream: false,
      process: 'process/browser',
    },
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  performance: {
    hints: false,
  },
};

export default baseClientConfig;

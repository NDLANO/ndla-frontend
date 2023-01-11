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
  // These entry points will be extracted as separate files when building for production.
  // The names that are used here will carry over into the actually compiled files.
  entry: {
    client: ['./src/client.tsx'],
    polyfill: ['@ndla/polyfill'],
    embed: ['./src/iframe/index.tsx'],
    lti: ['./src/lti/index.tsx'],
  },
  resolve: {
    // defaults only includes .js, .json and .wasm
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  // Disable hints regarding files that are too large
  performance: {
    hints: false,
  },
};

export default baseClientConfig;

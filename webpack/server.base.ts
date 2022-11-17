/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

import { Configuration } from 'webpack';

const serverBaseConfig: Configuration = {
  name: 'server',
  target: 'node',
  stats: 'errors-warnings',
  infrastructureLogging: {
    level: 'warn',
  },
  entry: {
    server: ['./src'],
  },
  // Treat node-builtins as externals to reduce bundle size during dev.
  externalsPresets: { node: true },
  resolve: {
    // This tells webpack to resolve esm modules before commonjs on the server-side.
    // @apollo/client stopped being bundled without this when moving from 3.4.x to 3.5.x
    mainFields: ['main', 'module'],
    // defaults only includes .js, .json and .wasm
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
};

export default serverBaseConfig;

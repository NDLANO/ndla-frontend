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
  resolve: {
    mainFields: ['main', 'module'],
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default serverBaseConfig;

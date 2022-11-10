/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

const getConfig = (env = 'production') => {
  if (env === 'development' || env === 'dev') {
    process.env.NODE_ENV = 'development';
    return [require('./client.dev').default, require('./server.dev').default];
  }
  process.env.NODE_ENV = 'production';
  return [require('./client.prod').default, require('./server.prod').default];
};

export default getConfig;

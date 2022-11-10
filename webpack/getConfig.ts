/**
 * Copyright (c) 2022-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree. *
 */

// Dynamically fetches dev or prod configs depending on the passed in environment.
// Do not rewrite this to regular imports, as it messes with the configurations.
const getConfig = (env = 'production') => {
  if (env === 'development' || env === 'dev') {
    process.env.NODE_ENV = 'development';
    return [require('./client.dev').default, require('./server.dev').default];
  }
  process.env.NODE_ENV = 'production';
  return [require('./client.prod').default, require('./server.prod').default];
};

export default getConfig;

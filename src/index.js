/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/*  eslint-disable no-console, global-require */

import express from 'express';

import config from './config';

let app = require('./server/server').default;

if (module.hot) {
  module.hot.accept('./server/server', function() {
    console.log('🔁  HMR Reloading `./server/server`...');
    try {
      app = require('./server/server').default;
    } catch (error) {
      console.error(error);
    }
  });
  console.info('✅  Server-side HMR Enabled!');
}

export default express()
  .use((req, res) => app.handle(req, res))
  .listen(config.port, function(err) {
    if (err) {
      console.error(err);
      return;
    }
    console.log(`> Started on port ${config.port}`);
  });

/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/*  eslint-disable no-console, global-require */

import http from 'http';

import config from './config';

import app from './server/server';

const server = http.createServer(app);
let currentApp = app;

server.listen(config.port, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀  Server started!');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server/server', () => {
    console.log('🔁  HMR Reloading `./server/server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server/server').default;
    server.on('request', newApp);
    currentApp = newApp;
  });
}

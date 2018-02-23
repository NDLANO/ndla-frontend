/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import http from 'http';

// const config = require('./config');

import app from './server/server';

const server = http.createServer(app);

let currentApp = app;

server.listen(process.env.PORT || 3000, error => {
  if (error) {
    console.log(error);
  }

  console.log('🚀 started');
});

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept('./server/server', () => {
    console.log('🔁  HMR Reloading `./server`...');
    server.removeListener('request', currentApp);
    const newApp = require('./server/server').default; //eslint-disable-line
    server.on('request', newApp);
    currentApp = newApp;
  });
}

// if (process.env.NOW !== 'true') {
//   const redirectConfig = require('./redirect');
//   const redirectServer = http.createServer(redirectConfig);
//   // If port is 79 the request has been dispatched with http protocol from ELB. Redirecting to https.
//   redirectServer.listen(config.redirectPort);
//   redirectServer.on('listening', () => {
//     console.log(`Listening for redirects on ${config.redirectPort}`);
//   });
// }

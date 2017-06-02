#!/usr/bin/env node
/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

/* eslint-disable */

var http = require('http');

require('babel-register');
require('babel-polyfill');

var config = require('../src/config');

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = config.disableSSR; // Disables server side rendering

var serverConfig = require('./server');

var server = http.createServer(serverConfig);

server.listen(config.port);
server.on('listening', () => {
  console.log('Listening on ' + config.port);
});

var redirectConfig = require('./redirect');
var redirectServer = http.createServer(redirectConfig);
// If port is 79 the request has been dispatched with http protocol from ELB. Redirecting to https.
redirectServer.listen(config.redirectPort);
redirectServer.on('listening', () => {
  console.log('Listening for redirects on ' + config.redirectPort);
});
/* eslint-enable */

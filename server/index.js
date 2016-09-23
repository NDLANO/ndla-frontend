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

var config = require('../src/config')

global.__CLIENT__ = false;
global.__SERVER__ = true;
global.__DISABLE_SSR__ = true;  // Disables server side rendering

var serverConfig = require('./server');

var server = http.createServer(serverConfig);

server.listen(config.port);
server.on('listening', () => {
  console.log('Listening on ' + config.port);
});
/* eslint-enable */

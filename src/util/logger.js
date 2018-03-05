/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// N.B! don't import this on the client!

const bunyan = require('bunyan');
require('source-map-support').install();

let log;

if (!log) {
  log = bunyan.createLogger({ name: 'ndla-frontend' });
}

log.logAndReturnValue = (level, msg, value) => {
  log[level](msg, value);
  return value;
};

module.exports = log;

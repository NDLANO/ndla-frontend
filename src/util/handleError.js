/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ErrorReporter from 'ndla-error-reporter';

const log =
  process.env.BUILD_TARGET === 'server' ? require('./logger') : undefined;

export default error => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.BUILD_TARGET === 'client'
  ) {
    ErrorReporter.getInstance().captureError(error);
  } else if (
    process.env.NODE_ENV === 'production' &&
    process.env.BUILD_TARGET === 'server'
  ) {
    log.error(error);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};

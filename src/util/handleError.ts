/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { ApolloError } from '@apollo/client';
import ErrorReporter from '@ndla/error-reporter';
import { ErrorInfo } from 'react';

const log =
  process.env.BUILD_TARGET === 'server' ? require('./logger') : undefined;

const handleError = (
  error: ApolloError | Error | string,
  info?: ErrorInfo | { clientTime: Date },
) => {
  if (
    process.env.NODE_ENV === 'production' &&
    process.env.BUILD_TARGET === 'client'
  ) {
    ErrorReporter.getInstance().captureError(error, info);
  } else if (
    process.env.NODE_ENV === 'production' &&
    process.env.BUILD_TARGET === 'server'
  ) {
    log.error(error);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};
export default handleError;

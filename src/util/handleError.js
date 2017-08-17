/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import ErrorReporter from 'ndla-error-reporter';

export default error => {
  if (process.env.NODE_ENV === 'production' && __CLIENT__) {
    ErrorReporter.getInstance().captureError(error);
  } else {
    console.error(error); // eslint-disable-line no-console
  }
};

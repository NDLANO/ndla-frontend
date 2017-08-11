/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take } from 'redux-saga/effects';
import ErrorReporter from 'ndla-error-reporter';
import { actions } from './';

export function* watchApplicationError() {
  while (true) {
    const { payload: { error } } = yield take(actions.applicationError);
    if (process.env.NODE_ENV === 'production') {
      ErrorReporter.getInstance().captureError(error);
    } else {
      console.error(error); // eslint-disable-line no-console
    }
  }
}

export default [watchApplicationError];

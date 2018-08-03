/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { take } from 'redux-saga/effects';
import { actions } from '.';
import handleError from '../../util/handleError';

export function* watchApplicationError() {
  while (true) {
    const { payload: error } = yield take(actions.applicationError);
    handleError(error);
  }
}

export default [watchApplicationError];

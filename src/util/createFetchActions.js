/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createActions } from 'redux-actions';

export default type =>
  createActions({
    [`FETCH_${type}`]: undefined,
    [`FETCH_${type}_SUCCESS`]: undefined,
    [`FETCH_${type}_ERROR`]: undefined,
  });

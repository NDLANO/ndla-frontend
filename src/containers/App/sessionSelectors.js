/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getAccessTokenFromState = state => state.accessToken;

export const getAccessToken = createSelector(
  [getAccessTokenFromState],
  accessToken => accessToken,
);

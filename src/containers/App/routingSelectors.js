/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createSelector } from 'reselect';

const getRoutingFromState = state => state.routing;

export const getLocationBeforeTransitions = createSelector(
  [getRoutingFromState],
  routing => routing.locationBeforeTransitions,
);

export const getPathnameBeforeTransitions = createSelector(
  [getLocationBeforeTransitions],
  location => location.pathname,
);

export const getSearchBeforeTransitions = createSelector(
  [getLocationBeforeTransitions],
  location => location.search,
);

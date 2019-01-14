/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import createBrowserHistory from 'history/createBrowserHistory';

export function createHistory(basename) {
  // avoid recreating history on HMR
  if (window.browserHistory) {
    return window.browserHistory;
  }
  const browserHistory = basename
    ? createBrowserHistory({ basename })
    : createBrowserHistory();

  window.browserHistory = browserHistory;
  return browserHistory;
}

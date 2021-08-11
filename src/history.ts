/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { createBrowserHistory, History, LocationDescriptor } from 'history';
import { STORED_LANGUAGE_KEY } from './constants';
import { NDLAWindow } from './interfaces';

declare global {
  interface Window extends NDLAWindow {}
}

// function appendBaseName(
//   to: LocationDescriptor<unknown>,
//   state: any,
//   callback: any,
// ) {
//   const language = window.localStorage.getItem(STORED_LANGUAGE_KEY)!;
//   if (typeof to === 'string') {
//     to = language + to;
//   }
//   if (typeof to === 'object' && to.pathname) {
//     to.pathname = language + to.pathname;
//   }
//   if (state !== undefined && state.pathname) {
//     //@ts-ignore
//     to.pathname = language + state.pathname;
//   }

//   return callback(to, state);
// }

export function createHistory(basename?: string): History {
  // avoid recreating history on HMR
  if (window.browserHistory) {
    return window.browserHistory;
  }
  const browserHistory = basename
    ? createBrowserHistory({ basename })
    : createBrowserHistory();

  // const push = browserHistory.push;
  // const replace = browserHistory.replace;
  // browserHistory.push = (to, state = undefined) =>
  //   appendBaseName(to, state, push);
  // browserHistory.replace = (to, state = undefined) =>
  //   appendBaseName(to, state, replace);

  window.browserHistory = browserHistory;
  return browserHistory;
}

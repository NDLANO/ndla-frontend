/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

function parseQueryString(query) {
  const entries = Array.from(new URLSearchParams(query));
  return entries.reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {});
}

function addLocationQuery(history) {
  const historyArg = history;
  historyArg.location = Object.assign(history.location, {
    query: parseQueryString(history.location.search),
  });
}

export default function configureHistory(history) {
  addLocationQuery(history);

  history.listen(() => {
    addLocationQuery(history);
  });
  return history;
}

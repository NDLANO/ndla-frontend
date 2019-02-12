/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

// Make it easy to add common options (i.e. headers) later
// by wrapping fetch
function createFetch(...args) {
  return fetch(...args);
}

export default createFetch;

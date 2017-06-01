/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

const errorReporter = store => next => action => {
  if (action.error) {
    const err = action.payload;
    if (err.status) {
      const json = err.json;
      console.error(
        `${err.status} ${err.message}: ${json.code} ${json.description}. %o`,
        json.messages,
      ); // eslint-disable-line no-console
    } else {
      console.error(action.payload, action, store.getState()); // eslint-disable-line no-console
    }
  }

  return next(action);
};

export default errorReporter;

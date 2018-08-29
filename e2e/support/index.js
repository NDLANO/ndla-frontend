/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './commands';

export const visitOptions = {
  onBeforeLoad: win => {
    win.fetch = null; // eslint-disable-line no-param-reassign
  },
};

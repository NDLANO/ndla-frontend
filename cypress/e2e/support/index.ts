/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import './commands';

Cypress.on('window:before:load', (win: Window) => {
  delete win.fetch;
});

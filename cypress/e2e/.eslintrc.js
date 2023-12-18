/**
 * Copyright (c) 2018-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

module.exports = {
  extends: '../../.eslintrc',
  rules: {
    'no-unused-expressions': 0,
    'object-shorthand': 0,
  },
  globals: {
    cy: true,
    Cypress: true,
  },
};

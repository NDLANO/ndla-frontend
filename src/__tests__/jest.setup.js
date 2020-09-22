/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import 'regenerator-runtime/runtime';

const jestTimeout = process.env.JEST_TIMEOUT
  ? parseInt(process.env.JEST_TIMEOUT, 10)
  : 30000;

jest.setTimeout(jestTimeout);

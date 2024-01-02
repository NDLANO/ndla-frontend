/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import "isomorphic-unfetch";

/* eslint-disable */
global.__CLIENT__ = false;
global.__SERVER__ = true;
/* eslint-enable */

jest.mock("../style/index.css", () => {});

global.DEFAULT_TIMEOUT = process.env.DEFAULT_TIMEOUT ? parseInt(process.env.DEFAULT_TIMEOUT, 10) : 250;

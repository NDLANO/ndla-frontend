/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isValidContextId } from "../urlHelper";

test("isValidContextId", () => {
  expect(isValidContextId("1022072a8411")).toBe(true);
  expect(isValidContextId("5ad439a5dacb")).toBe(true);
  expect(isValidContextId("_vendor-DAL8SGeP.js")).toBe(false);
  expect(isValidContextId("83ce68bc-19c9-4f2b-8dba-caf401428f21")).toBe(false);
});

/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTrackedPath } from "../PageTitle";

test("getTrackedPath with article-url and empty language", () => {
  const url = getTrackedPath("/article/123");
  expect(url).toMatch("/article/123");
});

test("getTrackedPath with article-url and non-default language", () => {
  const url = getTrackedPath("/nn/article/123");
  expect(url).toMatch("/article/123");
});

test("getTrackedPath with article-url and default language", () => {
  const url = getTrackedPath("/nb/article/123");
  expect(url).toMatch("/article/123");
});

test("getTrackedPath with iframe-url and nb language", () => {
  const url = getTrackedPath("/article-iframe/nb/urn:topic:123/1");
  expect(url).toMatch("/article-iframe/urn:topic:123/1");
});

test("getTrackedPath with iframe-url and nn language", () => {
  const url = getTrackedPath("/article-iframe/nn/urn:topic:123/1");
  expect(url).toMatch("/article-iframe/urn:topic:123/1");
});

test("getTrackedPath with iframe-url and no language", () => {
  const url = getTrackedPath("/article-iframe/urn:topic:123/1");
  expect(url).toMatch("/article-iframe/urn:topic:123/1");
});

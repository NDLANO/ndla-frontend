/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { getTrackedUrl } from "../PageTitle";

test("getTrackedUrl with article-url and empty language", () => {
  const url = getTrackedUrl("/article/123");
  expect(url).toMatch("https://test.ndla.no/article/123");
});

test("getTrackedUrl with article-url and non-default language", () => {
  const url = getTrackedUrl("/nn/article/123");
  expect(url).toMatch("https://test.ndla.no/article/123");
});

test("getTrackedUrl with article-url and default language", () => {
  const url = getTrackedUrl("/nb/article/123");
  expect(url).toMatch("https://test.ndla.no/article/123");
});

test("getTrackedUrl with iframe-url and nb language", () => {
  const url = getTrackedUrl("/article-iframe/nb/urn:topic:123/1");
  expect(url).toMatch("https://test.ndla.no/article-iframe/urn:topic:123/1");
});

test("getTrackedUrl with iframe-url and nn language", () => {
  const url = getTrackedUrl("/article-iframe/nn/urn:topic:123/1");
  expect(url).toMatch("https://test.ndla.no/article-iframe/urn:topic:123/1");
});

test("getTrackedUrl with iframe-url and no language", () => {
  const url = getTrackedUrl("/article-iframe/urn:topic:123/1");
  expect(url).toMatch("https://test.ndla.no/article-iframe/urn:topic:123/1");
});

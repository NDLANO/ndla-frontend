/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parseOembedUrl } from "../urlHelper";

const validArticleUrl1 = "https://www.test.ndla.no/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
const validArticleUrl2 = "http://localhost:3000/subject:3/topic:1:168542/topic:1:173292/resource:1:168554";
const validArticleUrl3 = "http://localhost:3000/subject:3/topic:1:168542/resource:1:168554";
const validArticleUrl4 = "https://www.test.ndla.no/unknown/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";

const validArticleUrlWithLang = "https://www.test.ndla.no/nn/subject:3/topic:1:55163/topic:1:168398/resource:1:1682";
const validTopicArticleUrl = "https://www.test.ndla.no/subject:3/topic:1:55163";
const unvalidArticleUrl = "https://www.test.ndla.no/subject:3";

const validateSimpleArticlePath1 = "https://www.test.ndla.no/article/4809";
const validateSimpleArticlePath2 = "https://www.test.ndla.no/nn/article/4809";

const unvalidateSimpleArticlePath = "https://www.test.ndla.no/articles/4809";

test("parseAndMatchUrl", () => {
  expect(parseOembedUrl(validArticleUrl1)).toMatchSnapshot();
  expect(parseOembedUrl(validTopicArticleUrl)).toMatchSnapshot();
  expect(parseOembedUrl(validArticleUrl2)).toMatchSnapshot();
  expect(parseOembedUrl(validArticleUrl3)).toMatchSnapshot();
  expect(parseOembedUrl(validArticleUrl4)).toMatchSnapshot();
  expect(parseOembedUrl(validArticleUrlWithLang)).toMatchSnapshot();
  expect(parseOembedUrl(unvalidArticleUrl)).toBe(null);
  expect(parseOembedUrl(validateSimpleArticlePath1)).toMatchSnapshot();
  expect(parseOembedUrl(validateSimpleArticlePath2)).toMatchSnapshot();
  expect(parseOembedUrl(unvalidateSimpleArticlePath)).toBe(null);
});

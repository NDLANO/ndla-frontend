/**
 * Copyright (c) 2019-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { parseOembedUrl, isCurrentPage } from "../urlHelper";

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

test("isCurrentPage", () => {
  // Without learningstep id
  expect(
    isCurrentPage(
      "/subject:1:a5d7da3a-8a19-4a83-9b3f-3c855621df70/topic:1:11f13e74-7cb8-4651-8d10-0927e7a9de48/topic:1:2bd24a78-b09c-4249-b9a2-a98e6364bfd9",
      {
        url: "/e/aarjelsaemien-voestesgïeline-sr-jaa1/guktie-buerebelaakan-tjaeledh/f8608f0cbe",
      },
    ),
  ).toBe(false);
  expect(
    isCurrentPage("/e/aarjelsaemien-voestesgïeline-sr-jaa1/guktie-buerebelaakan-tjaeledh/f8608f0cbe", {
      url: "/e/aarjelsaemien-voestesgïeline-sr-jaa1/guktie-buerebelaakan-tjaeledh/f8608f0cbe",
    }),
  ).toBe(true);
  // With learningstep id
  expect(
    isCurrentPage(
      "/subject:1:ec288dfb-4768-4f82-8387-fe2d73fff1e1/topic:2:182777/topic:1:7db324c6-b6e1-45eb-acd4-34ae29d0a79c/resource:1:178554/1269",
      {
        url: "/r/tysk-2/vier-mutige-norweger-in-deutschland/ec0f7deca4",
      },
    ),
  ).toBe(false);
  expect(
    isCurrentPage("/r/tysk-2/vier-mutige-norweger-in-deutschland/ec0f7deca4/1269", {
      url: "/r/tysk-2/vier-mutige-norweger-in-deutschland/ec0f7deca4",
    }),
  ).toBe(true);
});

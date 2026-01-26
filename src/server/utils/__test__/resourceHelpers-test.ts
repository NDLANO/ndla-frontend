/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import * as helper from "../resourceHelpers";

const testHelper = <T, R>(fn: (val: T) => R, input: T, expected: R) => expect(fn(input)).toBe(expected);

test("resourceHelpers/isLearningPathResource ", () => {
  testHelper(helper.isLearningPathResource, "urn:learningpath:123", true);
  testHelper(helper.isLearningPathResource, "urn:learningpath:123asfdlj1sdbnfk23edsdsdf", true);
  testHelper(helper.isLearningPathResource, "urn:article:123", false);
  testHelper(helper.isLearningPathResource, undefined, false);
});

test("resourceHelpers/isArticleResource ", () => {
  testHelper(helper.isArticleResource, "urn:article:123", true);
  testHelper(helper.isArticleResource, "urn:learningpath:123", false);
  testHelper(helper.isArticleResource, "urn:articl:123", false);
  testHelper(helper.isArticleResource, undefined, false);
});

test("resourceHelpers/getArticleIdFromResource ", () => {
  testHelper(helper.getArticleIdFromResource, "urn:article:123", "123");
  testHelper(helper.getArticleIdFromResource, "urn:learningpath:123", undefined);
  testHelper(
    helper.getArticleIdFromResource,
    "urn:article:123s0-dfnsdf-jkhs-dhfkj1l237",
    "123s0-dfnsdf-jkhs-dhfkj1l237",
  );
  testHelper(helper.getArticleIdFromResource, undefined, undefined);
});

test("resourceHelpers/getLearningPathIdFromResource ", () => {
  testHelper(helper.getLearningPathIdFromResource, "urn:learningpath:123", "123");
  testHelper(helper.getLearningPathIdFromResource, "urn:article:123", undefined);
  testHelper(
    helper.getLearningPathIdFromResource,
    "urn:learningpath:123s0-dfnsdf-jkhs-dhfkj1l237",
    "123s0-dfnsdf-jkhs-dhfkj1l237",
  );
  testHelper(helper.getLearningPathIdFromResource, undefined, undefined);
});

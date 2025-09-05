/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isValidLocale, getLocaleInfoFromPath, getHtmlLang } from "../i18n";

test("i18n getHtmlLanguage()", () => {
  expect(getHtmlLang("nn")).toBe("nn");

  expect(getHtmlLang("nb")).toBe("nb");

  // Defaults to nb if locale not found
  expect(getHtmlLang("ru")).toBe("nb");
});

test("i18n isValidLocale()", () => {
  expect(isValidLocale("nb")).toBe(true);
  expect(isValidLocale("nn")).toBe(true);
  expect(isValidLocale("en")).toBe(true);
  expect(isValidLocale("aa")).toBe(false);
  expect(isValidLocale("ub")).toBe(false);
});

test("i18n getLocaleInfoFromPath", () => {
  expect(getLocaleInfoFromPath("/nb/subjects/").basepath).toBe("/subjects/");
  expect(getLocaleInfoFromPath("/nb/subjects/").basename).toBe("nb");

  expect(getLocaleInfoFromPath("/nn/subjects/").basepath).toBe("/subjects/");
  expect(getLocaleInfoFromPath("/nn/subjects/").basename).toBe("nn");

  expect(getLocaleInfoFromPath("/subjects/").basepath).toBe("/subjects/");
  expect(getLocaleInfoFromPath("/subjects/").basename).toBe("");
});

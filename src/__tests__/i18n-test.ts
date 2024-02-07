/**
 * Copyright (c) 2016-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { isValidLocale, getLocaleInfoFromPath, getLocaleObject } from "../i18n";

test("i18n getLocaleObject()", () => {
  expect(getLocaleObject("nn").abbreviation).toBe("nn");

  expect(getLocaleObject("nb").abbreviation).toBe("nb");

  // Defaults to nb if locale not found
  expect(getLocaleObject("ru").abbreviation).toBe("nb");
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

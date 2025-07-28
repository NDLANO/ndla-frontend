/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/?disableSSR=true");
});

test("should have list of valid links on frontpage", async ({ page, waitGraphql }) => {
  await waitGraphql();
  const programmes = page.getByTestId("programme-list").getByRole("link");
  await expect(programmes).toHaveCount(16);
});

test("should have functioning language anchor", async ({ page }) => {
  const languageSelector = page.getByTestId("language-selector");
  await languageSelector.click();

  await expect(languageSelector).toContainText("Nynorsk");
  expect(page.url().includes("/nn/")).toBeTruthy();
  await languageSelector.click();
  await expect(languageSelector).toContainText("Bokmål");
  expect(page.url().includes("/nb/")).toBeTruthy();
});

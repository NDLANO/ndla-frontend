/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test } from "../../apiMock";

test.beforeEach(async ({ page, waitGraphql }) => {
  await page.goto("/minndla/subjects?disableSSR=true");
  await waitGraphql();
});

test("all subjects button works", async ({ page }) => {
  const allSubjectsButton = page.getByRole("link", { name: "Alle fag" });
  await expect(allSubjectsButton).toBeVisible();
  await expect(allSubjectsButton).toBeInViewport();
  await allSubjectsButton.click();

  await page.waitForURL("/subjects");
  await expect(page.getByRole("heading", { name: "Alle fag" })).toBeInViewport();
});

test("has list of favoritesubjects", async ({ page }) => {
  await expect(page.getByRole("main").getByRole("list").getByRole("listitem").getByRole("link")).toHaveCount(2);
});

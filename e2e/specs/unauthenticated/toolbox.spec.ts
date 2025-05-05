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

test("shows students", async ({ page, waitGraphql }) => {
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("menuitem", { name: "Verktøykassa - for elever" }).click();
  await waitGraphql();
  await expect(page.getByRole("heading", { name: "Verktøykassa – for elever" })).toBeVisible();

  const navList = page.getByRole("navigation", { name: "Emner" }).getByRole("list");

  await expect(navList.getByRole("listitem")).toHaveCount(16);
  await expect(navList.getByRole("link")).toHaveCount(16);
});

test("shows teachers", async ({ page, waitGraphql }) => {
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("menuitem", { name: "Verktøykassa - for lærere" }).click();
  await waitGraphql();
  await expect(page.getByRole("heading", { name: "Verktøykassa – for lærere" })).toBeVisible();

  const navList = page.getByRole("navigation", { name: "Emner" }).getByRole("list");
  await expect(navList.getByRole("listitem")).toHaveCount(13);
  await expect(navList.getByRole("link")).toHaveCount(13);
});

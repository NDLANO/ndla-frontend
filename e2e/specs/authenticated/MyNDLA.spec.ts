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
  await page.goto("/minndla");
});

test("have favourite subjects", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Mine fag" })).toBeVisible();
  expect(await page.getByRole("main").locator("section").first().getByRole("listitem").count()).toBeGreaterThanOrEqual(
    1,
  );

  const toFolder = page.getByRole("link", { name: "Se alle favorittfag" });
  await expect(toFolder).toBeVisible();
  await toFolder.click();
  await expect(page.getByRole("heading", { name: "Mine fag" })).toBeVisible();
});

test("have recently added to folder", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Nylig lagt til i mine mapper" })).toBeVisible();
  expect(await page.getByRole("main").locator("section").first().getByRole("listitem").count()).toBeGreaterThanOrEqual(
    1,
  );

  const toFolder = page.getByRole("link", { name: "Se alle mappene dine" });
  await expect(toFolder).toBeVisible();
  await toFolder.click();
  await expect(page.getByRole("heading", { name: "Mine mapper" })).toBeVisible();
});

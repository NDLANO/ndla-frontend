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
  await page.goto("/minndla?disableSSR=true");
  await waitGraphql();
});

test("have favourite subjects", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Mine fag" })).toBeVisible();
  const listItems = await page.getByRole("list", { name: "Mine fag" }).getByRole("listitem").count();
  expect(listItems).toBeGreaterThanOrEqual(1);

  const toFolder = page.getByRole("link", { name: "Se alle favorittfag" });
  await expect(toFolder).toBeVisible();
  await toFolder.click();
  await expect(page.getByRole("heading", { name: "Mine fag" })).toBeVisible();
});

test("have recently added to folder", async ({ page }) => {
  const headingText = "Nylig lagt til i mine mapper";
  await expect(page.getByRole("heading", { name: headingText })).toBeVisible();
  const listItems = await page.getByRole("list", { name: headingText }).getByRole("listitem").count();
  expect(listItems).toBeGreaterThanOrEqual(1);

  const toFolder = page.getByRole("link", { name: "Se alle mappene dine" });
  await expect(toFolder).toBeVisible();
  await toFolder.click();
  await expect(page.getByRole("heading", { name: "Mine mapper" })).toBeVisible();
});

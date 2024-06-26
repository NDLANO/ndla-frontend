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
  await page.goto("/minndla/arena/category/1");
  await page.waitForLoadState("domcontentloaded");
});

test("can open post in topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeVisible();
  expect(await page.getByRole("main").getByRole("listitem").count()).toBeGreaterThanOrEqual(1);

  const link = page.getByTestId("arena-topic-card").first();
  const linkHeading = (await link.locator("label").textContent()) ?? "";
  await link.click();
  await page.waitForURL("/minndla/arena/topic/*");
  await expect(page.getByRole("main").getByRole("heading", { name: linkHeading })).toHaveText(linkHeading);
});

test("can cancel when creating topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Nytt innlegg" }).last().click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");
  await page.waitForLoadState("networkidle");
  await page.getByRole("button", { name: "Avbryt" }).click();
  await page.waitForURL("/minndla/arena/category/1");
});

test("can cancel and get unsaved edits message when creating topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeVisible();
  await page.waitForLoadState("networkidle");
  await page.getByRole("link", { name: "Nytt innlegg" }).last().click();
  await page.waitForLoadState("networkidle");
  await page.waitForURL("/minndla/arena/category/1/topic/new");
  await page.getByLabel("Tittel").click();
  await page.keyboard.type("Test test");
  await page.getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText("Forkast nytt innlegg");
  await page.getByRole("button", { name: "Forkast innlegget" }).click();
  await page.waitForURL("/minndla/arena/category/1");
});

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

test("can create and delete topic", async ({ page, harCheckpoint }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeVisible();
  await page.getByRole("link", { name: "Nytt innlegg" }).first().click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");

  const tittel = "Playwright test tittel";

  await page.locator("#field-editor").waitFor();
  await page.getByLabel("Tittel").click();
  await page.keyboard.type(tittel);
  await page.locator("#field-editor").click();
  await page.keyboard.type("Playwright test content");

  await page.getByRole("button", { name: "Publiser" }).click();
  await harCheckpoint();
  await page.waitForURL(new RegExp("/minndla/arena/topic/\\d+"));
  await expect(page.getByRole("heading", { name: tittel })).toBeVisible();

  await page.getByLabel("Vis redigeringsmuligheter").click();
  await harCheckpoint();
  await page.getByRole("menuitem", { name: "Slett innlegget" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await harCheckpoint();
  await page.getByRole("dialog").getByRole("button", { name: "Slett innlegg" }).click();
  await page.waitForURL("minndla/arena/category/1");
  await page.getByRole("heading", { name: "Test kategori" }).waitFor();
});

test("can cancel when creating topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeVisible();
  await page.getByRole("link", { name: "Nytt innlegg" }).first().click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");
  await page.getByRole("button", { name: "Avbryt" }).click();
  await page.waitForURL("/minndla/arena/category/1");
});

test("can cancel and get unsaved edits message when creating topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeVisible();
  await page.getByRole("link", { name: "Nytt innlegg" }).first().click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");
  await page.getByLabel("Tittel").click();
  await page.keyboard.type("Test test");
  await page.getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText("Forkast nytt innlegg");
  await page.getByRole("button", { name: "Forkast innlegget" }).click();
  await page.waitForURL("/minndla/arena/category/1");
});

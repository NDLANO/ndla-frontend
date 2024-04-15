/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test, mockWaitResponse } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/?disableSSR=true");
});

test("shows students", async ({ page }) => {
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("menuitem", { name: "Verktøykassa - for elever" }).click();
  await mockWaitResponse(page, "**/graphql-api/*");
  await expect(page.getByRole("heading", { name: "Verktøykassa – for elever" })).toBeVisible();

  await expect(page.getByTestId("nav-box-item")).toHaveCount(16);

  const links = page.getByTestId("nav-box-list").getByRole("listitem").getByRole("link");

  await expect(links).toHaveCount(16);
});

test("shows teachers", async ({ page }) => {
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("menuitem", { name: "Verktøykassa - for lærere" }).click();
  await mockWaitResponse(page, "**/graphql-api/*");
  await expect(page.getByRole("heading", { name: "Verktøykassa – for lærere" })).toBeVisible();

  await expect(page.getByTestId("nav-box-item")).toHaveCount(13);

  const links = page.getByTestId("nav-box-list").getByRole("listitem").getByRole("link");

  await expect(links).toHaveCount(13);
});

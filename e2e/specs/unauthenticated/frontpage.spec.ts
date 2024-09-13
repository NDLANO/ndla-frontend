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

test("should have list of valid links on frontpage", async ({ page }) => {
  await mockWaitResponse(page, "**/graphql-api/*");
  const programmes = page.getByTestId("programme-list").getByRole("link");
  await expect(programmes).toHaveCount(16);
});

test("show have functioning language box", async ({ page }) => {
  await page.getByRole("combobox").getByText("Velg språk").click();

  expect(page.getByRole("option").getByText("Bokmål")).toBeTruthy();

  await page.getByRole("option").getByText("Nynorsk").click();

  await expect(page.getByRole("combobox").getByText("Vel språk")).toBeVisible();

  expect(page.url().includes("/nn/")).toBeTruthy();
});

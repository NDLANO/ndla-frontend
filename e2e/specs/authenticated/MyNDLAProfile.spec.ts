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
  await page.goto("/minndla/profile?disableSSR=true");
  await waitGraphql();
});

test("has name, school and profile image", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Anne LærerVGS Haugen" })).toBeAttached();
  expect(page.getByRole("heading", { name: "Anne LærerVGS Haugen" })).toBeTruthy();
  expect(page.getByText("LERK VGS")).toBeTruthy();
  expect(page.locator('div[data-myprofile="true"]')).toBeTruthy();
});

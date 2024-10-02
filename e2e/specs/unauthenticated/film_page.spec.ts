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
  await page.goto("/subject:20?disableSSR=true");
});

test("film page has content", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Chef Flynn", exact: true }).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId("nav-box-list").getByRole("listitem").getByRole("link")).toHaveCount(8);
});

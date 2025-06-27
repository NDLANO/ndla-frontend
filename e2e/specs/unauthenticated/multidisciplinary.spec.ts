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

test("contains content", async ({ page, waitGraphql }) => {
  await waitGraphql();
  await page.getByRole("button").getByText("Meny").click();
  await page.getByRole("link", { name: "Tverrfaglige tema" }).first().click();
  await waitGraphql();
  await page.waitForLoadState();
  const heading = page.getByRole("heading").getByText("Tverrfaglige temaer");
  expect(heading).toBeDefined();
  await expect(heading).toBeVisible();
});

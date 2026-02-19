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
  await page.goto("/f/ndla-film/24d0e0db3c02?disableSSR=true");
  await waitGraphql();
});

test("film page has content", async ({ page }) => {
  await expect(page.getByRole("link", { name: "Bærekraftig utvikling", exact: true }).first()).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByTestId("nav-box-list").getByRole("listitem").getByRole("link")).toHaveCount(8);
});

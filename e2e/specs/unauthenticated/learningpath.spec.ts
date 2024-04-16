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
  await page.goto("/learningpaths/8/?disableSSR=true");
});

test("contains content", async ({ page }) => {
  const heading = page.getByRole("heading").getByText("Introduksjon");
  expect(heading).toBeDefined();
  await expect(heading).toBeVisible();

  const menuIntro = page.getByRole("heading").getByText("Sirkulasjonssystemet");
  expect(menuIntro).toBeDefined();
  await expect(menuIntro).toBeVisible();
});

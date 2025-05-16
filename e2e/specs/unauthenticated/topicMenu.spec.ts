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

test("menu is displayed", async ({ page, waitGraphql }) => {
  await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();
  await waitGraphql();
  await page.getByRole("link", { name: "Mediesamfunnet 1" }).last().click();
  await waitGraphql();
  await page.getByTestId("masthead-menu-button").click();
  await waitGraphql();
  expect(page.getByRole("link", { name: "Mediesamfunnet 1" })).toBeDefined();
});

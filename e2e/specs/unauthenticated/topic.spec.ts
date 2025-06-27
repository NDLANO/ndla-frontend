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

test("contains article header and introduction", async ({ page, waitGraphql }) => {
  await waitGraphql();
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("link", { name: "Alle fag", exact: true }).click();
  await waitGraphql();
  await page.getByText("ALLE FAG").last().click();
  await page.getByRole("link", { name: "Medieuttrykk 3" }).last().click();
  await waitGraphql();
  await page
    .getByRole("navigation", { name: "Emner" })
    .getByRole("listitem")
    .getByRole("link", { name: "Idéskaping og mediedesign" })
    .click();
  await waitGraphql();
  await expect(page.getByRole("heading", { name: "Idéskaping og mediedesign", exact: true })).toBeVisible();
});

test("show have functioning language box", async ({ page, waitGraphql }) => {
  await waitGraphql();
  await page.getByRole("button", { name: "Meny" }).click();
  await page.getByRole("link", { name: "Alle fag", exact: true }).click();
  await page.getByText("ALLE FAG").last().click();
  await page.getByRole("link", { name: "Medieuttrykk 3" }).last().click();
  await page
    .getByRole("navigation", { name: "Emner" })
    .getByRole("listitem")
    .getByRole("link", { name: "Tverrfaglige medieoppdrag" })
    .click();

  await waitGraphql();

  await expect(page.getByRole("heading", { name: "Tverrfaglige medieoppdrag", exact: true })).toBeVisible();
});

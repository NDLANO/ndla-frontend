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
  await page.goto("/?disableSSR=true");

  await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();
  await waitGraphql();
  await page.getByRole("link", { name: "Mediesamfunnet 1" }).last().click();
  await waitGraphql();
  await expect(page.getByRole("heading", { name: "Mediesamfunnet 1" })).toBeVisible();

  const competenceButton = page.getByRole("button").getByText("Vis kompetansemål");
  await expect(competenceButton).not.toBeDisabled();
});

test("should have valid breadcrumbs", async ({ page }) => {
  const breadcrumb = page
    .getByLabel("Brødsmulesti")
    .getByRole("list")
    .filter({ has: page.locator("svg") });
  await expect(breadcrumb).toHaveCount(1);
  await expect(breadcrumb.getByRole("link")).toHaveCount(1);
});

test("include a list of valid topic links", async ({ page }) => {
  const nav = page.getByRole("navigation", { name: "Emner" });
  await expect(nav.getByRole("list").getByRole("listitem")).toHaveCount(8);

  expect(nav.getByRole("list").getByRole("link").all());

  const links = await nav.getByRole("list").getByRole("link").all();

  expect(links).toHaveLength(8);
});

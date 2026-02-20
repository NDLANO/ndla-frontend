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
  await page.goto("/minndla?disableSSR=true");
  await waitGraphql();
});

test("can navigate to my favorites", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Mine favoritter" }).click();
  await expect(page.getByRole("heading").getByText("Mine favoritter")).toBeVisible();
});

test("can navigate to learningpaths", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Mine læringsstier" }).click();
  await expect(page.getByRole("heading").getByText("Mine læringsstier")).toBeVisible();
});

test("can navigate to subjects", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Mine fag" }).click();
  await expect(page.getByRole("heading").getByText("Mine fag")).toBeVisible();
});

test("can navigate to profile", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Min profil" }).click();
  await expect(page.getByRole("heading").getByText("Min profil")).toBeVisible();
});

test("have all options at the different pages", async ({ page, waitGraphql }) => {
  await waitGraphql();
  await expect(page.getByRole("link", { name: "Logg ut" })).toBeVisible({ timeout: 10000 });
  const options = await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts();

  await page.getByRole("listitem").getByRole("link", { name: "Mine favoritter" }).click();
  await expect(page.getByRole("heading").getByText("Mine favoritter")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toMatchObject(options);

  await page.getByRole("listitem").getByRole("link", { name: "Mine læringsstier" }).click();
  await expect(page.getByRole("heading").getByText("Mine læringsstier")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toMatchObject(options);

  await page.getByRole("listitem").getByRole("link", { name: "Mine fag" }).click();
  await expect(page.getByRole("heading").getByText("Mine fag")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toMatchObject(options);

  await page.getByRole("listitem").getByRole("link", { name: "Min profil" }).click();
  await expect(page.getByRole("heading").getByText("Min profil")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toMatchObject(options);
});

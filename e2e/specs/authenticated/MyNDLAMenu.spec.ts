/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockGraphqlRoute } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        fixture: "minndla_menu_myndladata",
        names: ["myNdlaData", "recentlyUsed"],
      },
      {
        fixture: "minndla_menu_folderMeta",
        names: ["folderResourceMetaSearch"],
      },
      {
        fixture: "minndla_menu_folder",
        names: ["foldersPage"],
      },
      {
        fixture: "minndla_menu_subjects",
        names: ["allSubjects"],
      },
    ],
  });
  await page.goto("/minndla");
});

test("can navigate to folders", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Mine mapper" }).click();
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
});

test("can navigate to subjects", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Mine favorittfag" }).click();
  await expect(page.getByRole("heading").getByText("Mine favorittfag")).toBeVisible();
});

test("can navigate to tags", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Mine emneknagger" }).click();
  await expect(page.getByRole("heading").getByText("Mine emneknagger")).toBeVisible();
});

test("can navigate to profile", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  await page.getByRole("listitem").getByRole("link", { name: "Min profil" }).click();
  await expect(page.getByRole("heading").getByText("Min profil")).toBeVisible();
});

test("have all options at the different pages", async ({ page }) => {
  await expect(page.getByRole("heading").getByText("Min NDLA")).toBeVisible();
  const options = await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts();
  await page.getByRole("listitem").getByRole("link", { name: "Mine mapper" }).click();
  await expect(page.getByRole("heading").getByText("Mine mapper")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toEqual(options);

  await page.getByRole("listitem").getByRole("link", { name: "Mine favorittfag" }).click();
  await expect(page.getByRole("heading").getByText("Mine favorittfag")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toEqual(options);

  await page.getByRole("listitem").getByRole("link", { name: "Mine emneknagger" }).click();
  await expect(page.getByRole("heading").getByText("Mine emneknagger")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toEqual(options);

  await page.getByRole("listitem").getByRole("link", { name: "Min profil" }).click();
  await expect(page.getByRole("heading").getByText("Min profil")).toBeVisible();
  expect(await page.getByTestId("my-ndla-menu").getByRole("listitem").allInnerTexts()).toEqual(options);
});

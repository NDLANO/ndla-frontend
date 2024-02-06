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
        fixture: "minndla_profile_myndladata",
        names: ["myNdlaData"],
      },
      {
        fixture: "minndla_profile_notifications",
        names: ["arenaNotificationsV2"],
      },
      {
        fixture: "minndla_profile_updatedata",
        names: ["updatePersonalData"],
      },
    ],
  });
  await page.goto("/minndla/profile");
});

test("has name, school and profile image", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Anne LærerVGS Haugen" })).toBeAttached();
  expect(page.getByRole("heading", { name: "Anne LærerVGS Haugen" })).toBeTruthy();
  expect(page.getByText("LERK VGS")).toBeTruthy();
  expect(page.locator('div[data-myprofile="true"]')).toBeTruthy();
  await expect(page.locator('div[data-myprofile="true"]')).toHaveText("AH");
});

test("can change folder sharing settings", async ({ page }) => {
  await expect(
    page.getByRole("heading", {
      name: "Velg om du vil vise navn når du deler en mappe",
    }),
  ).toBeAttached();
  const [show, dontShow] = await page.locator("form").locator("button").all();
  await expect(show).toBeChecked();
  await expect(dontShow).toBeChecked({ checked: false });

  await dontShow.click();
  await expect(dontShow).toBeChecked();
  await expect(show).toBeChecked({ checked: false });

  await expect(page.getByText("Navnet ditt er nå fjernet fra alle dine delte mapper")).toBeInViewport();

  await show.click();
  await expect(show).toBeChecked();
  await expect(dontShow).toBeChecked({ checked: false });

  await expect(page.getByText("Navnet ditt vises nå på alle dine delte mapper")).toBeInViewport();
});

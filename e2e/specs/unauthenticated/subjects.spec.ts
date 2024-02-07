/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { test, expect } from "@playwright/test";
import { mockGraphqlRoute, mockWaitResponse } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await mockGraphqlRoute({
    page,
    operation: [
      {
        names: ["myNdlaData", "alerts", "frontpageData", "mastheadProgramme", "mastheadFrontpage"],
        fixture: "subjects_frontpage",
      },
      {
        names: ["programmePage"],
        fixture: "subjects_programme",
      },
      {
        names: ["mastHead", "subjectPageTest"],
        fixture: "subjects_masthead",
      },
    ],
  });
  await page.goto("/?disableSSR=true");

  await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await page.getByRole("link", { name: "Mediesamfunnet 1" }).last().click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
});

test("should have valid breadcrumbs", async ({ page }) => {
  const breadcrumb = page.getByRole("list").filter({ has: page.locator("svg") });
  await expect(breadcrumb).toHaveCount(1);
  await expect(breadcrumb.getByRole("link")).toHaveCount(1);
});

test("include a list of valid topic links", async ({ page }) => {
  await expect(page.getByTestId("nav-box-item")).toHaveCount(8);

  const links = await page.getByTestId("nav-box-list").getByRole("link").all();

  expect(links).toHaveLength(8);
});

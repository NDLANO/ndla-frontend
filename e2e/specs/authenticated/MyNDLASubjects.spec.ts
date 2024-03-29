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
        fixture: "minndla_subjects_mydata",
        names: ["myNdlaData"],
      },
      { fixture: "minndla_subjects_allSubjects", names: ["allSubjects"] },
      {
        fixture: "minndla_subjects_mydata",
        names: ["alerts", "mastheadFrontpage", "mastheadProgramme", "myNdlaData"],
      },
      {
        fixture: "minndla_subjects_subjects",
        names: ["allSubjects"],
      },
      {
        fixture: "minndla_subjects_data",
        names: ["arenaNotificationsV2"],
      },
    ],
  });
  await page.goto("/minndla/subjects");
});

test("all subjects button works", async ({ page }) => {
  const allSubjectsButton = page.getByRole("link", { name: "Alle fag" });
  await expect(allSubjectsButton).toBeVisible();
  await expect(allSubjectsButton).toBeInViewport();
  await allSubjectsButton.click();

  await page.waitForURL("/subjects");
  await expect(page.getByRole("heading", { name: "Alle fag" })).toBeInViewport();
});

test("has list of favoritesubjects", async ({ page }) => {
  await expect(page.getByRole("main").getByRole("list").getByRole("listitem").getByRole("link")).toHaveCount(2);
});

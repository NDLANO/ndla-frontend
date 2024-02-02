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
        names: ["myNdlaData", "frontpageData", "alerts", "mastheadFrontpage", "mastheadProgramme"],
        fixture: "topic_menu_topicmenu",
      },
      {
        names: ["programmePage"],
        fixture: "topic_menu_programme",
      },
      {
        names: ["mastHead", "subjectPageTest"],
        fixture: "topic_menu_subject_topic_menu",
      },
      {
        names: ["competenceGoals"],
        fixture: "topic_menu_competence_goals",
      },
    ],
  });

  await page.goto("/?disableSSR=true");
});

test("menu is displayed", async ({ page }) => {
  await page.getByTestId("programme-list").getByRole("link", { name: "Medier og kommunikasjon" }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await page.getByRole("link", { name: "Mediesamfunnet 1" }).last().click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await page.getByTestId("masthead-menu-button").click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  expect(page.getByRole("link", { name: "Mediesamfunnet 1" })).toBeDefined();
});

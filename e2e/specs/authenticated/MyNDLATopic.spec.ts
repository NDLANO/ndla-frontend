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
        fixture: "minndla_topic_myndladata",
        names: ["myNdlaData", "arenaCategoryV2"],
      },
      {
        fixture: "minndla_topic_notifications",
        names: ["arenaNotificationsV2"],
      },
      {
        fixture: "minndla_topic_post",
        names: ["arenaNotifications", "arenaTopicByIdV2"],
      },
      {
        fixture: "minndla_topic_newPost",
        names: ["NewArenaTopicV2"],
      },
      {
        fixture: "minndla_topic_post_loaded",
        names: ["arenaCategoryV2", "arenaTopicByIdV2", "arenaNotifications"],
      },
      {
        fixture: "minndla_topic_post_data_create",
        names: ["arenaCategoryV2", "arenaTopicByIdV2"],
      },
      {
        fixture: "minndla_topic_post_loaded_new",
        names: ["arenaTopicByIdV2"],
      },
    ],
  });
  await page.goto("/minndla/arena/category/1");
});

test("can open post in topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeInViewport();

  expect(await page.getByRole("main").getByRole("listitem").count()).toBeGreaterThanOrEqual(1);

  const link = page.getByTestId("arena-topic-card").first();
  const linkHeading = (await link.locator("label").textContent()) ?? "";
  await link.click();
  await page.waitForURL("/minndla/arena/topic/*");
  await expect(page.getByRole("main").getByRole("heading", { name: linkHeading })).toHaveText(linkHeading);
});

test("can create topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeInViewport();
  await page.getByRole("link", { name: "Nytt innlegg" }).click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");

  const tittel = "Playwright test tittel";
  const content = "Playwright test content";
  await page.getByLabel("Tittel").click();
  await page.keyboard.type(tittel);
  await page.locator("#field-editor").click();
  await page.keyboard.type(content);

  await page.getByRole("button", { name: "Publiser" }).click();

  await page.waitForURL("/minndla/arena/topic/*");
  await expect(page.getByRole("heading", { name: tittel })).toHaveText(tittel);
  await expect(page.getByText(content)).toBeInViewport();
});

test("can cancel when creating topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeInViewport();
  await page.getByRole("link", { name: "Nytt innlegg" }).click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");
  await page.getByRole("button", { name: "Avbryt" }).click();
  await page.waitForURL("/minndla/arena/category/1");
});

test("can cancel and get usaved edits message when creating topic", async ({ page }) => {
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeInViewport();
  await page.getByRole("link", { name: "Nytt innlegg" }).click();
  await page.waitForURL("/minndla/arena/category/1/topic/new");
  await page.getByLabel("Tittel").click();
  await page.keyboard.type("Test test");
  await page.getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog")).toBeInViewport();
  await expect(page.getByRole("dialog").getByRole("heading")).toHaveText("Forkast nytt innlegg");
  await page.getByRole("button", { name: "Forkast innlegget" }).click();
  await page.waitForURL("/minndla/arena/category/1");
  await expect(page.getByRole("main").filter({ has: page.locator('[data-style="h1-resource"]') })).toBeInViewport();
});

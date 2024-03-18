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
        fixture: "minndla_post_topics",
        names: ["arenaNotificationsV2", "arenaTopicByIdV2", "mastheadFrontpage", "myNdlaData"],
      },
      {
        fixture: "minndla_post_category",
        names: ["ArenaUserV2", "ArenaUserV2", "arenaCategoryV2", "arenaNotificationsV2"],
      },
      {
        fixture: "minndla_post_reply",
        names: ["ReplyToTopicV2"],
      },
      {
        fixture: "minndla_post_topic",
        names: ["arenaTopicByIdV2"],
      },
      {
        fixture: "minndla_post_update",
        names: ["UpdatePostV2"],
      },
      {
        fixture: "minndla_post_delete",
        names: ["DeletePostV2"],
      },
    ],
  });
  await page.goto("/minndla/arena/topic/7");
});

test("has main post and comments", async ({ page }) => {
  const title = (await page.getByRole("main").getByRole("heading").first().textContent()) ?? "";
  await expect(page.getByRole("heading", { name: title })).toBeInViewport();
  await expect(page.locator('li[data-main-post="true"]')).toHaveCount(1);
  await expect(page.locator('li[data-main-post="false"]')).toHaveCount(2);
});

test("can add and delete comment", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Test på innlegg" })).toBeInViewport();
  await page.getByRole("button", { name: "Skriv et svar" }).last().click();
  await expect(page.locator("div[data-lexical-editor='true']")).toBeInViewport();
  const answer = "Test kommentar!!!";
  await page.keyboard.type(answer);
  await page.getByRole("button", { name: "Publiser" }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");

  const postCard = page.getByRole("main").getByRole("listitem");
  await expect(postCard.getByText(answer)).toHaveCount(1);
  await postCard.last().getByRole("button").click();
  await page.getByRole("menuitem", { name: "Slett innlegget" }).click();

  await expect(page.getByRole("dialog")).toBeInViewport();
  await page.getByRole("dialog").getByRole("button", { name: "Slett kommentar" }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
});

test("can edit comment", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Test på innlegg" })).toBeInViewport();
  const comment =
    (await page.locator('li[data-main-post="false"]').first().getByRole("paragraph").last().textContent()) ?? "";
  await page.locator('li[data-main-post="false"]').first().getByRole("button").click();
  await page.getByRole("menuitem", { name: "Rediger innlegg" }).click();
  await expect(page.locator("div[data-lexical-editor='true']")).toBeInViewport();
  await page.keyboard.press("Shift+a");
  await page.keyboard.type(Math.random().toString(36).slice(2, 7));
  await page.getByRole("button", { name: "Publiser" }).click();
  await mockWaitResponse(page, "**/graphql-api/graphql");
  await expect(page.locator("#field-editor-21")).not.toBeInViewport();
  await expect(page.locator('li[data-main-post="false"]').first().getByRole("paragraph").last()).not.toHaveText(
    comment,
  );
});

test("cancelling add comment with text gives warning", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Test på innlegg" })).toBeInViewport();
  await page.getByRole("button", { name: "Skriv et svar" }).last().click();
  await expect(page.locator("div[data-lexical-editor='true']")).toBeInViewport();
  const answer = "Test kommentar!!!";
  await page.keyboard.type(answer);

  await page.getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Forkast nytt svar" })).toBeInViewport();
  await page.getByRole("button", { name: "Forkast svaret" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Forkast nytt svar" })).not.toBeInViewport();
});

test("cancelling edit comment with edits gives warning", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Test på innlegg" })).toBeInViewport();
  const comment =
    (await page.locator('li[data-main-post="false"]').first().getByRole("paragraph").last().textContent()) ?? "";
  await page.locator('li[data-main-post="false"]').first().getByRole("button").click();
  await page.getByRole("menuitem", { name: "Rediger innlegg" }).click();
  await expect(page.locator("div[data-lexical-editor='true']")).toBeInViewport();
  await page.keyboard.type("aaaaa");

  await page.getByRole("button", { name: "Avbryt" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Avbryt redigering" })).toBeInViewport();
  await page.getByRole("button", { name: "Avbryt redigeringen" }).click();
  await expect(page.getByRole("dialog").getByRole("heading", { name: "Avbryt redigering" })).not.toBeInViewport();
  await expect(page.locator('li[data-main-post="false"]').first().getByRole("paragraph").last()).toHaveText(comment);
});

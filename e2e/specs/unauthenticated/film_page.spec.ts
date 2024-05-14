/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test, mockWaitResponse } from "../../apiMock";

test.beforeEach(async ({ page }) => {
  await page.goto("/subject:20?disableSSR=true");
});

test("film page has content", async ({ page }) => {
  await mockWaitResponse(page, "**/graphql-api/*");
  await expect(page.locator("span", { hasText: "Chef Flynn" }).first()).toBeVisible();
  const subjects = page.locator("div", {
    has: page.getByRole("heading", { name: "Emner i film:" }),
    hasNot: page.locator("span", { hasText: "Sammen skaper vi framtidas læring" }),
  });
  await expect(subjects.getByRole("navigation").getByRole("list").getByRole("listitem")).toHaveCount(7);
  const identitet = page.locator("div", {
    has: page.getByRole("heading", { name: "Identitet" }),
    hasNot: page.locator("span", { hasText: "Sammen skaper vi framtidas læring" }),
  });
  await expect(identitet.getByRole("listitem")).toHaveCount(7);
});

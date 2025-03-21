/**
 * Copyright (c) 2024-present, NDLA.
 *
 * This source code is licensed under the GPLv3 license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import { expect } from "@playwright/test";
import { test, mockWaitResponse } from "../../apiMock";

test("contains search bar", async ({ page }) => {
  await page.goto("/search/?disableSSR=true");
  await mockWaitResponse(page, "**/graphql-api/*");

  const input = page.getByRole("searchbox");

  await expect(input).toBeVisible();

  const subjectMaterialCheckbox = page.getByLabel("Læringssti");
  await expect(subjectMaterialCheckbox).toBeVisible();
});

test("LTI contains action elements", async ({ page }) => {
  await page.goto("/lti/?disableSSR=true");

  const input = page.getByRole("searchbox");
  expect(input).toBeDefined();
  await expect(input).toBeVisible();

  const button = page.locator("button", { hasText: "Sett inn" }).first();

  expect(button).toBeDefined();
  await expect(button).toBeVisible();
});
